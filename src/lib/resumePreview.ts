import { supabase } from '@/lib/supabase';

const SUPABASE_PUBLIC_OBJECT_MARKER = '/storage/v1/object/public/';

/**
 * Parse a Supabase "public" object URL into bucket + object path for signed URL creation.
 * Public URLs often still return 401 when the bucket is private — signed URLs fix that.
 */
export function parseSupabasePublicObjectUrl(url: string): { bucket: string; objectPath: string } | null {
  if (!url || typeof url !== 'string' || !url.includes(SUPABASE_PUBLIC_OBJECT_MARKER)) {
    return null;
  }
  try {
    const pathname = new URL(url).pathname;
    const pos = pathname.indexOf(SUPABASE_PUBLIC_OBJECT_MARKER);
    if (pos === -1) return null;
    const rest = pathname.slice(pos + SUPABASE_PUBLIC_OBJECT_MARKER.length);
    const segments = rest.split('/').filter(Boolean);
    if (segments.length < 2) return null;
    const bucket = segments[0];
    const encodedPath = segments.slice(1).join('/');
    let objectPath = encodedPath.replace(/\+/g, ' ');
    try {
      objectPath = decodeURIComponent(objectPath);
    } catch {
      /* keep as-is */
    }
    if (!bucket || !objectPath) return null;
    return { bucket, objectPath };
  } catch {
    return null;
  }
}

/**
 * Returns a URL suitable for browser access.
 * Supabase: exchanges public-path URLs for time-limited signed URLs (needs Storage SELECT policy).
 * Cloudinary / other: returns the URL unchanged.
 */
export async function getResumeAccessibleUrl(rawUrl: string, expiresSec = 3600): Promise<string> {
  const parsed = parseSupabasePublicObjectUrl(rawUrl);
  if (!parsed) return rawUrl;

  const { data, error } = await supabase.storage
    .from(parsed.bucket)
    .createSignedUrl(parsed.objectPath, expiresSec);

  if (error || !data?.signedUrl) {
    throw new Error(
      error?.message ||
        `Could not sign storage URL for "${parsed.bucket}". Check Supabase Storage policies (SELECT) for this bucket and path.`
    );
  }
  return data.signedUrl;
}

const BLOB_PREVIEW_REVOKE_MS = 10 * 60 * 1000; // 10 minutes — enough to read; then free memory

/**
 * Load file in the app first (fetch → blob URL), then open.
 * Avoids Chrome's built-in PDF viewer requesting Cloudinary/Supabase directly (often 401 with Referrer / auth rules).
 */
async function openUrlViaBlobInNewTab(url: string): Promise<{ ok: true } | { ok: false; status?: number }> {
  try {
    const res = await fetch(url, { mode: 'cors', credentials: 'omit' });
    if (!res.ok) return { ok: false, status: res.status };
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    const win = window.open(blobUrl, '_blank', 'noopener,noreferrer');
    if (!win) {
      URL.revokeObjectURL(blobUrl);
      return { ok: false };
    }
    setTimeout(() => URL.revokeObjectURL(blobUrl), BLOB_PREVIEW_REVOKE_MS);
    return { ok: true };
  } catch {
    return { ok: false };
  }
}

export async function openResumePreview(rawUrl: string): Promise<void> {
  const url = await getResumeAccessibleUrl(rawUrl);

  const blobResult = await openUrlViaBlobInNewTab(url);
  if (blobResult.ok) return;

  if (blobResult.status === 401 || blobResult.status === 403) {
    throw new Error(
      'Resume file refused access (401/403). If the file is on Cloudinary: Dashboard → Settings → Security — turn off strict referrer blocking for delivery, or allow your site URL. If it is on Supabase: ensure the resumes bucket allows read for signed URLs.'
    );
  }

  const win = window.open(url, '_blank', 'noopener,noreferrer');
  if (!win) {
    throw new Error('Popup blocked. Allow popups for this site.');
  }
}

export async function triggerResumeDownload(rawUrl: string, downloadFilename: string): Promise<void> {
  const url = await getResumeAccessibleUrl(rawUrl);

  try {
    const res = await fetch(url, { mode: 'cors', credentials: 'omit' });
    if (res.ok) {
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = downloadFilename;
      link.rel = 'noopener noreferrer';
      link.click();
      setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
      return;
    }
    if (res.status === 401 || res.status === 403) {
      throw new Error(
        'Download refused (401/403). Check Cloudinary Security / referrer settings or Supabase Storage policies.'
      );
    }
  } catch (e) {
    if (e instanceof Error && e.message.includes('401')) throw e;
    if (e instanceof Error && e.message.includes('403')) throw e;
    /* fall through to direct link */
  }

  const link = document.createElement('a');
  link.href = url;
  link.download = downloadFilename;
  link.rel = 'noopener noreferrer';
  link.target = '_blank';
  link.click();
}
