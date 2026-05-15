import { supabase } from '@/lib/supabase';
import { uploadApplicantProfileImage, uploadApplicantResume } from '@/lib/applicantMediaUpload';

export interface ApplicantFormData {
  // Step 1
  fullName: string;
  mobileNumber: string;
  email: string;
  state: string;
  city: string;
  address?: string;
  pincode?: string;
  jobRole: string;
  communicationSkill: string;

  // Step 2
  highestQualification: string;
  educationBoard?: string;
  mediumOfStudy?: string;
  stream?: string; // For 12th
  courseDegreeName?: string;
  universityInstitute?: string;
  percentageGrade?: string;
  cgpaSgpa?: string; // CGPA or SGPA
  cgpaSgpaValue?: string; // Actual value
  yearOfPassing: string;

  // Step 3
  workExperience: string;
  totalExperience?: string;
  currentCompany?: string;
  currentDesignation?: string;
  currentCTC?: string;
  expectedCTC?: string;
  keySkills: string[];

  // Step 4
  resumeFile?: File;
  profilePicture?: File;
}

export const saveApplicantToDatabase = async (
  formData: ApplicantFormData,
  userId: string
): Promise<{ success: boolean; applicantId?: string; error?: string }> => {
  try {
    // Prepare applicant data for database
    const applicantData: any = {
      user_id: userId,
      name: formData.fullName,
      full_name: formData.fullName,
      phone: formData.mobileNumber,
      mobile_number: formData.mobileNumber,
      email: formData.email,
      email_address: formData.email,
      city: formData.city,
      city_current_location: formData.city,
      job_role: formData.jobRole,
      skill_job_role_applying_for: formData.jobRole,
      communication: formData.communicationSkill,
      
      // Education
      education_level: formData.highestQualification,
      highest_qualification: formData.highestQualification,
      education_board: formData.educationBoard,
      medium: formData.mediumOfStudy,
      medium_of_study: formData.mediumOfStudy,
      course_degree: formData.courseDegreeName,
      course_degree_name: formData.courseDegreeName,
      university: formData.universityInstitute,
      university_institute_name: formData.universityInstitute,
      passing_year: formData.yearOfPassing ? parseInt(formData.yearOfPassing) : null,
      year_of_passing: formData.yearOfPassing,
      
      // Percentage/CGPA
      percentage: formData.percentageGrade || formData.cgpaSgpaValue || null,
      
      // Experience
      experience_type: formData.workExperience,
      work_experience: formData.workExperience,
      total_experience: formData.totalExperience,
      total_experience_numbers: formData.totalExperience,
      current_company: formData.currentCompany,
      current_designation: formData.currentDesignation,
      current_ctc: formData.currentCTC,
      expected_ctc: formData.expectedCTC,
      exp_ctc: formData.expectedCTC,
      
      // Skills
      key_skills: formData.keySkills.join(', '),
      
      // Status
      status: 'submitted',
      otp_verified: true,
      verified: false,
      
      // Calculate profile completion
      profile_complete_percent: calculateProfileCompletion(formData),
    };

    // Upload files if provided
    if (formData.resumeFile) {
      try {
        const resumeUrl = await uploadApplicantResume(formData.resumeFile, { authUserId: userId });
        applicantData.resume_file = resumeUrl;
        applicantData.upload_cv_any_format = resumeUrl;
      } catch (e) {
        console.error('Resume upload failed:', e);
      }
    }

    if (formData.profilePicture) {
      try {
        const profileImageUrl = await uploadApplicantProfileImage(formData.profilePicture, {
          authUserId: userId,
        });
        applicantData.profile_image = profileImageUrl;
      } catch (e) {
        console.error('Profile image upload failed:', e);
      }
    }

    // Insert into applicants table
    const { data, error } = await supabase
      .from('applicants')
      .insert(applicantData)
      .select('id')
      .single();

    if (error) {
      console.error('Error saving applicant:', error);
      return { success: false, error: error.message };
    }

    return { success: true, applicantId: data.id };
  } catch (error: any) {
    console.error('Error in saveApplicantToDatabase:', error);
    return { success: false, error: error.message || 'Failed to save applicant data' };
  }
};

/** Update profile summary (stored in profiles.summary). */
export const updateProfileSummary = async (
  userId: string,
  summary: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ summary: summary.trim() || null, updated_at: new Date().toISOString() })
      .eq('id', userId);

    if (error) {
      console.error('Error updating profile summary:', error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (error: any) {
    console.error('Error in updateProfileSummary:', error);
    return { success: false, error: error?.message || 'Failed to update summary' };
  }
};

/** Update applicant row (flat fields). Use for profile edit from applicants table. */
export const updateApplicantProfile = async (
  applicantId: string,
  updates: Record<string, unknown>
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('applicants')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', applicantId);

    if (error) {
      console.error('Error updating applicant profile:', error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (error: any) {
    console.error('Error in updateApplicantProfile:', error);
    return { success: false, error: error?.message || 'Failed to update profile' };
  }
};

const calculateProfileCompletion = (formData: ApplicantFormData): number => {
  let completed = 0;
  let total = 0;

  // Step 1 fields (6 required)
  total += 6;
  if (formData.fullName) completed++;
  if (formData.mobileNumber) completed++;
  if (formData.email) completed++;
  if (formData.city) completed++;
  if (formData.jobRole) completed++;
  if (formData.communicationSkill) completed++;

  // Step 2 fields (varies by qualification)
  total += 5;
  if (formData.highestQualification) completed++;
  if (formData.yearOfPassing) completed++;
  if (formData.courseDegreeName || formData.educationBoard) completed++;
  if (formData.universityInstitute) completed++;
  if (formData.percentageGrade || formData.cgpaSgpaValue) completed++;

  // Step 3 fields
  total += 2;
  if (formData.workExperience) completed++;
  if (formData.keySkills && formData.keySkills.length > 0) completed++;

  // Step 4
  total += 1;
  if (formData.resumeFile) completed++;

  return Math.round((completed / total) * 100);
};

// Helper function to calculate months between dates
const calculateMonths = (startDate: string, endDate: string | null, isCurrent: boolean): number => {
  if (!startDate) return 0;
  const start = new Date(startDate);
  const end = isCurrent || !endDate ? new Date() : new Date(endDate);
  return (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
};

// Phase 2: Save to normalized tables - Atomic save order following saveApplicantFull pattern
export const saveApplicantPhase2 = async (
  formData: {
    personal: any;
    address: any;
    education: any;
    experience: any;
    skills: any;
    files: any;
  },
  userId: string
): Promise<{ success: boolean; applicantId?: string; applicantNumber?: string; error?: string }> => {
  try {
    // 0. Ensure profile exists (DO NOT modify role - database handles this)
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (!profile) {
      // Fallback create profile manually - use role from user metadata or default to applicant
      const { data: { user: authUser } } = await supabase.auth.getUser();
      const userRole = authUser?.user_metadata?.role || 'applicant';
      
      await supabase.from('profiles').insert({
        id: userId,
        email: formData.personal.email?.trim().toLowerCase() || '',
        full_name: '',
        role: userRole // Use role from metadata, not hardcoded
      });
    }
    // DO NOT modify existing profile role - database trigger handles this correctly

    // 0.5. Check if applicant already exists for this user
    const { data: existingApplicant } = await supabase
      .from('applicants')
      .select('id, applicant_number')
      .eq('user_id', userId)
      .maybeSingle();

    if (existingApplicant) {
      // Applicant already exists, return existing record
      console.log('Applicant record already exists for this user, returning existing record');
      return {
        success: true,
        applicantId: existingApplicant.id,
        applicantNumber: existingApplicant.applicant_number
      };
    }

    // 1. Insert applicant record (return id and applicant_number)
    // Normalize email: lowercase and trim
    const normalizedEmail = formData.personal.email?.trim().toLowerCase() || '';
    // Normalize phone: ensure +91 format
    const phone = formData.personal.mobileNumber?.trim() || '';
    const normalizedPhone = phone.startsWith('+91') ? phone : `+91${phone}`;

    // Fetch city name if cityId is provided
    let cityName = '';
    if (formData.address?.cityId) {
      const { data: cityData } = await supabase
        .from('cities')
        .select('name')
        .eq('id', formData.address.cityId)
        .single();
      
      if (cityData?.name) {
        cityName = cityData.name;
      }
    }
    
    // Fallback: use city from personal info if available, or empty string
    if (!cityName && formData.personal?.city) {
      cityName = formData.personal.city;
    }
    
    // If still no city, use a default or throw error
    if (!cityName) {
      throw new Error('City is required. Please select a city in the address step.');
    }

    const applicantPayload = {
      user_id: userId,
      name: formData.personal.fullName?.trim() || '',
      phone: normalizedPhone,
      email: normalizedEmail,
      city: cityName, // Required field
      job_role: formData.personal.jobRole || '',
      communication: formData.personal.communicationSkill || '',
      status: 'submitted'
    };

    const { data: applicantData, error: appErr } = await supabase
      .from('applicants')
      .insert(applicantPayload)
      .select('id, applicant_number')
      .single();

    if (appErr) {
      // Handle duplicate key error (race condition or double submission)
      const errorMessage = appErr.message || String(appErr);
      const errorCode = appErr.code || (appErr as any).code;
      
      console.log('Insert error details:', { code: errorCode, message: errorMessage, fullError: appErr });
      
      if (errorCode === '23505' || errorMessage?.includes('duplicate key') || errorMessage?.includes('unique constraint')) {
        // It's a duplicate key error - try to find existing record with retries
        console.log('Duplicate key error detected, attempting to find existing record...');
        console.log('Error details:', { errorCode, errorMessage, userId, normalizedEmail, normalizedPhone });
        
        // Retry logic with exponential backoff (up to 5 attempts with longer delays)
        // Increased retries because transaction isolation might delay visibility
        const maxRetries = 5;
        const baseDelay = 500; // Start with 500ms (longer initial delay)
        
        for (let attempt = 0; attempt <= maxRetries; attempt++) {
          const delay = baseDelay * Math.pow(2, attempt); // Exponential backoff: 500ms, 1000ms, 2000ms, 4000ms, 8000ms
          
          if (attempt > 0) {
            console.log(`Retry attempt ${attempt}/${maxRetries} after ${delay}ms delay...`);
            await new Promise(resolve => setTimeout(resolve, delay));
          }
          
          // Strategy 1: Try to fetch by user_id (most reliable)
          const { data: existingByUserId, error: userIdErr } = await supabase
            .from('applicants')
            .select('id, applicant_number, created_at')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();
          
          if (existingByUserId && !userIdErr) {
            console.log(`✅ Found existing applicant record by user_id (attempt ${attempt + 1}):`, existingByUserId);
            return {
              success: true,
              applicantId: existingByUserId.id,
              applicantNumber: existingByUserId.applicant_number
            };
          }
          
          // Strategy 2: Try to fetch by email (fallback)
          if (normalizedEmail) {
            const { data: existingByEmail, error: emailErr } = await supabase
              .from('applicants')
              .select('id, applicant_number, created_at')
              .eq('email', normalizedEmail)
              .order('created_at', { ascending: false })
              .limit(1)
              .maybeSingle();
            
            if (existingByEmail && !emailErr) {
              console.log(`✅ Found existing applicant record by email (attempt ${attempt + 1}):`, existingByEmail);
              return {
                success: true,
                applicantId: existingByEmail.id,
                applicantNumber: existingByEmail.applicant_number
              };
            }
          }
          
          // Strategy 3: Try to fetch by phone (another fallback)
          if (normalizedPhone) {
            const { data: existingByPhone, error: phoneErr } = await supabase
              .from('applicants')
              .select('id, applicant_number, created_at')
              .eq('phone', normalizedPhone)
              .order('created_at', { ascending: false })
              .limit(1)
              .maybeSingle();
            
            if (existingByPhone && !phoneErr) {
              console.log(`✅ Found existing applicant record by phone (attempt ${attempt + 1}):`, existingByPhone);
              return {
                success: true,
                applicantId: existingByPhone.id,
                applicantNumber: existingByPhone.applicant_number
              };
            }
          }
          
          // Strategy 4: Try to get ALL applicants for this user (in case maybeSingle() is the issue)
          if (attempt >= 2) {
            const { data: allApplicants, error: allErr } = await supabase
              .from('applicants')
              .select('id, applicant_number, created_at')
              .eq('user_id', userId)
              .order('created_at', { ascending: false })
              .limit(5);
            
            if (allApplicants && allApplicants.length > 0 && !allErr) {
              const latest = allApplicants[0];
              console.log(`✅ Found existing applicant record via list query (attempt ${attempt + 1}):`, latest);
              return {
                success: true,
                applicantId: latest.id,
                applicantNumber: latest.applicant_number
              };
            }
          }
          
          // Log progress for debugging
          if (attempt < maxRetries) {
            console.log(`⏳ No record found yet (attempt ${attempt + 1}/${maxRetries + 1}), will retry...`);
          }
        }
        
        // Final attempt: One more query after a longer delay
        console.log('Performing final query after extended delay...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const { data: finalAttempt } = await supabase
          .from('applicants')
          .select('id, applicant_number')
          .eq('user_id', userId)
          .maybeSingle();
        
        if (finalAttempt) {
          console.log('✅ Found existing applicant record on final attempt:', finalAttempt);
          return {
            success: true,
            applicantId: finalAttempt.id,
            applicantNumber: finalAttempt.applicant_number
          };
        }
        
        // If we still can't find it after all retries, return a helpful error
        console.error('❌ Could not find existing applicant record after all retries and strategies.');
        console.error('This might indicate:', {
          'Transaction isolation delay': 'Record might not be visible yet',
          'Database trigger issue': 'The database trigger fix may not be applied',
          'RLS policy issue': 'Row Level Security might be blocking the query',
          'User ID mismatch': `Expected user_id: ${userId}`
        });
        
        return {
          success: false,
          error: 'A duplicate application was detected, but we could not retrieve the existing record. This usually resolves itself within a few seconds. Please refresh the page and check your dashboard. If the issue persists, contact support.'
        };
      }
      
      console.error('Error saving applicant:', appErr);
      throw appErr;
    }

    const applicantId = applicantData.id;
    const applicantNumber = applicantData.applicant_number;

    // 2. Insert address
    if (formData.address) {
      const addressPayload = {
        applicant_id: applicantId,
        address_line1: formData.address.addressLine1?.trim() || null,
        address_line2: formData.address.addressLine2?.trim() || null,
        pincode: formData.address.pincode?.trim() || null,
        city_id: formData.address.cityId || null,
        district_id: formData.address.districtId || null,
        state_id: formData.address.stateId || null,
        landmark: formData.address.landmark?.trim() || null,
      };

      const { error: addrErr } = await supabase
        .from('applicant_addresses')
        .insert(addressPayload);

      if (addrErr) {
        console.warn('Error saving address (non-blocking):', addrErr);
        // Continue - address is optional
      }
    }

    // 3. Insert education (bulk)
    if (formData.education?.entries && formData.education.entries.length > 0) {
      const eduRows = formData.education.entries.map((e: any) => ({
        applicant_id: applicantId,
        education_level: e.educationLevel,
        board_id: e.boardId || null,
        institution_id: e.institutionId || null,
        degree_id: e.degreeId || null,
        course_id: e.courseId || null,
        percentage: e.percentage ? parseFloat(e.percentage) : null,
        passing_year: e.passingYear ? parseInt(e.passingYear) : null,
        city_id: formData.address?.cityId || null,
        state_id: formData.address?.stateId || null,
        district_id: formData.address?.districtId || null,
        is_highest: e.isHighest || false,
        medium: e.medium || null,
        stream: e.stream || null,
      }));

      const { error: eduErr } = await supabase
        .from('applicant_education')
        .insert(eduRows);

      if (eduErr) {
        console.warn('Error saving education (non-blocking):', eduErr);
        // Continue - education entries are important but not blocking
      }
    }

    // 4. Insert experience
    if (formData.experience?.entries && formData.experience.entries.length > 0) {
      const expRows = formData.experience.entries.map((ex: any) => ({
        applicant_id: applicantId,
        company_name: ex.companyName?.trim() || '',
        designation: ex.designation?.trim() || '',
        employment_type: ex.employmentType || 'full-time',
        start_date: ex.startDate || null,
        end_date: ex.isCurrent ? null : (ex.endDate || null),
        is_current: ex.isCurrent || false,
        total_experience_months: calculateMonths(ex.startDate, ex.endDate, ex.isCurrent),
        current_ctc: ex.currentCtc?.trim() || null,
        expected_ctc: ex.expectedCtc?.trim() || null,
        notice_period: ex.noticePeriod || null,
        city_id: ex.cityId || null,
      }));

      const { error: expErr } = await supabase
        .from('applicant_experience')
        .insert(expRows);

      if (expErr) {
        console.warn('Error saving experience (non-blocking):', expErr);
        // Continue - experience is optional
      }
    }

    // 5. Insert skills
    if (formData.skills?.entries && formData.skills.entries.length > 0) {
      const skillsRows = formData.skills.entries.map((s: any) => ({
        applicant_id: applicantId,
        skill_name: s.skillName?.trim() || '',
        skill_type: s.skillType || 'technical',
        skill_level: s.skillLevel || 'intermediate',
      }));

      const { error: skillsErr } = await supabase
        .from('applicant_skills')
        .insert(skillsRows);

      if (skillsErr) {
        console.warn('Error saving skills (non-blocking):', skillsErr);
        // Continue - skills are important but not blocking
      }
    }

    // 6. Insert files: files should already be uploaded, URLs are in formData.files
    if (formData.files) {
      const fileEntries = [];

      // Resume file
      if (formData.files.resumeFile?.url) {
        fileEntries.push({
          applicant_id: applicantId,
          file_type: 'resume', // must be one of enum values
          file_url: formData.files.resumeFile.url,
          uploaded_by: userId
        });
      }

      // Profile picture
      if (formData.files.profilePicture?.url) {
        fileEntries.push({
          applicant_id: applicantId,
          file_type: 'profile_image', // must be one of enum values
          file_url: formData.files.profilePicture.url,
          uploaded_by: userId
        });
      }

      if (fileEntries.length > 0) {
        const { error: filesErr } = await supabase
          .from('applicant_files')
          .insert(fileEntries);

        if (filesErr) {
          console.warn('Error saving files (non-blocking):', filesErr);
          // Continue - files are important but not blocking
        }
      }
    }

    // 7. Return success
    return { success: true, applicantId, applicantNumber };
  } catch (error: any) {
    console.error('Error in saveApplicantPhase2:', error);
    return { success: false, error: error.message || 'Failed to save applicant data' };
  }
};

