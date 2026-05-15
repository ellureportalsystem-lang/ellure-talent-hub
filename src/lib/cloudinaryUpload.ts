export type CloudinaryResourceType = 'image' | 'raw';

export function isCloudinaryRawConfigured(): boolean {
  const cloud = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined;
  return Boolean(cloud?.trim() && getUploadPreset('raw'));
}

export function isCloudinaryImageConfigured(): boolean {
  const cloud = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined;
  return Boolean(cloud?.trim() && getUploadPreset('image'));
}

function cloudName(): string {
  const n = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined;
  if (!n?.trim()) throw new Error('VITE_CLOUDINARY_CLOUD_NAME is not set');
  return n.trim();
}

/** Raw resumes vs profile images may use different unsigned presets in Cloudinary. */
export function getUploadPreset(kind: 'raw' | 'image'): string {
  const generic = (import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string | undefined)?.trim();
  const rawSpecific = (import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET_RAW as string | undefined)?.trim();
  const imageSpecific = (import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET_IMAGE as string | undefined)?.trim();
  if (kind === 'raw') return rawSpecific || generic || '';
  return imageSpecific || generic || '';
}

/**
 * Unsigned upload (browser-safe). Create upload presets in Cloudinary with signing mode "Unsigned".
 */
export async function uploadToCloudinary(
  file: File,
  options: { resourceType: CloudinaryResourceType; publicId?: string }
): Promise<{ secure_url: string; public_id?: string }> {
  const uploadPreset = getUploadPreset(options.resourceType === 'raw' ? 'raw' : 'image');
  if (!uploadPreset) {
    throw new Error(
      options.resourceType === 'raw'
        ? 'Set VITE_CLOUDINARY_UPLOAD_PRESET or VITE_CLOUDINARY_UPLOAD_PRESET_RAW'
        : 'Set VITE_CLOUDINARY_UPLOAD_PRESET or VITE_CLOUDINARY_UPLOAD_PRESET_IMAGE'
    );
  }

  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName()}/${options.resourceType}/upload`;
  const form = new FormData();
  form.append('file', file);
  form.append('upload_preset', uploadPreset);
  if (options.publicId) {
    form.append('public_id', options.publicId);
  }

  const res = await fetch(endpoint, { method: 'POST', body: form });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(text || `Cloudinary upload failed (${res.status})`);
  }
  let json: { secure_url?: string; public_id?: string; error?: { message?: string } };
  try {
    json = JSON.parse(text) as typeof json;
  } catch {
    throw new Error('Invalid response from Cloudinary');
  }
  if (json.error?.message) {
    throw new Error(json.error.message);
  }
  if (!json.secure_url) {
    throw new Error('Cloudinary response missing secure_url');
  }
  return { secure_url: json.secure_url, public_id: json.public_id };
}
