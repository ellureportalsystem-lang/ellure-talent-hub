import { supabase } from '@/lib/supabase';
import { isCloudinaryImageConfigured, isCloudinaryRawConfigured, uploadToCloudinary } from '@/lib/cloudinaryUpload';

export type ApplicantResumeUploadContext = {
  /** Persisted applicant row — preferred for stable URLs */
  applicantId?: string;
  /** Auth user id (registration flow before applicant row exists) */
  authUserId?: string;
};

function assertContext(ctx: ApplicantResumeUploadContext): void {
  if (!ctx.applicantId && !ctx.authUserId) {
    throw new Error('Resume upload requires applicantId or authUserId');
  }
}

function resumePaths(ctx: ApplicantResumeUploadContext, ext: string) {
  const ts = Date.now();
  const safeExt = ext.replace(/^\./, '') || 'pdf';
  if (ctx.applicantId) {
    const base = `ellure/applicants/${ctx.applicantId}/resume_${ts}`;
    return {
      cloudinaryPublicId: `${base}.${safeExt}`,
      supabasePath: `applicants/${ctx.applicantId}/resume_${ts}.${safeExt}`,
    };
  }
  const uid = ctx.authUserId as string;
  const base = `ellure/registrations/${uid}/resume_${ts}`;
  return {
    cloudinaryPublicId: `${base}.${safeExt}`,
    supabasePath: `applicants/${uid}/resume_${ts}.${safeExt}`,
  };
}

function profilePaths(ctx: ApplicantResumeUploadContext, ext: string) {
  const ts = Date.now();
  const safeExt = ext.replace(/^\./, '') || 'jpg';
  if (ctx.applicantId) {
    const base = `ellure/applicants/${ctx.applicantId}/profile_${ts}`;
    return {
      cloudinaryPublicId: `${base}.${safeExt}`,
      supabasePath: `applicants/${ctx.applicantId}/profile_${ts}.${safeExt}`,
    };
  }
  const uid = ctx.authUserId as string;
  const base = `ellure/registrations/${uid}/profile_${ts}`;
  return {
    cloudinaryPublicId: `${base}.${safeExt}`,
    supabasePath: `applicants/${uid}/profile_${ts}.${safeExt}`,
  };
}

export async function uploadApplicantResume(
  file: File,
  ctx: ApplicantResumeUploadContext
): Promise<string> {
  assertContext(ctx);
  const ext = file.name.includes('.') ? (file.name.split('.').pop() as string) : 'pdf';
  const { cloudinaryPublicId, supabasePath } = resumePaths(ctx, ext);

  if (isCloudinaryRawConfigured()) {
    const { secure_url } = await uploadToCloudinary(file, {
      resourceType: 'raw',
      publicId: cloudinaryPublicId,
    });
    return secure_url;
  }

  const { error } = await supabase.storage
    .from('resumes')
    .upload(supabasePath, file, { cacheControl: '3600', upsert: true });

  if (error) {
    console.error('Supabase resume upload error:', error);
    throw new Error(error.message || 'Failed to upload resume');
  }

  const { data: urlData } = supabase.storage.from('resumes').getPublicUrl(supabasePath);
  return urlData.publicUrl;
}

export async function uploadApplicantProfileImage(
  file: File,
  ctx: ApplicantResumeUploadContext
): Promise<string> {
  assertContext(ctx);
  const ext = file.name.includes('.') ? (file.name.split('.').pop() as string) : 'jpg';
  const { cloudinaryPublicId, supabasePath } = profilePaths(ctx, ext);

  if (isCloudinaryImageConfigured()) {
    const imagePublicId = cloudinaryPublicId.replace(/\.[^.]+$/, '');
    const { secure_url } = await uploadToCloudinary(file, {
      resourceType: 'image',
      publicId: imagePublicId,
    });
    return secure_url;
  }

  const { error } = await supabase.storage
    .from('resumes')
    .upload(supabasePath, file, { cacheControl: '3600', upsert: true });

  if (error) {
    console.error('Supabase profile image upload error:', error);
    throw new Error(error.message || 'Failed to upload image');
  }

  const { data: urlData } = supabase.storage.from('resumes').getPublicUrl(supabasePath);
  return urlData.publicUrl;
}
