import { supabase } from '@/lib/supabase';

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
      key_skill: formData.keySkills.join(', '),
      
      // Status
      status: 'submitted',
      otp_verified: true,
      verified: false,
      
      // Calculate profile completion
      profile_complete_percent: calculateProfileCompletion(formData),
    };

    // Upload files if provided
    if (formData.resumeFile) {
      const resumeUrl = await uploadFile(formData.resumeFile, userId, 'resume');
      if (resumeUrl) {
        applicantData.resume_file = resumeUrl;
        applicantData.upload_cv_any_format = resumeUrl;
      }
    }

    if (formData.profilePicture) {
      const profileImageUrl = await uploadFile(formData.profilePicture, userId, 'profile');
      if (profileImageUrl) {
        applicantData.profile_image = profileImageUrl;
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

const uploadFile = async (
  file: File,
  userId: string,
  type: 'resume' | 'profile'
): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const timestamp = Date.now();
    const fileName = `${type}_${timestamp}.${fileExt}`;
    // New folder structure: resumes/applicants/{user_id}/resume_timestamp.pdf
    const filePath = `applicants/${userId}/${fileName}`;

    // Upload to resumes bucket
    const { data, error } = await supabase.storage
      .from('resumes')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Error uploading file:', error);
      // Return placeholder URL as fallback
      return `placeholder://${fileName}`;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('resumes')
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Error in uploadFile:', error);
    // Return placeholder URL as fallback
    const fileExt = file.name.split('.').pop();
    const timestamp = Date.now();
    const fileName = `${type}_${timestamp}.${fileExt}`;
    return `placeholder://${fileName}`;
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

    // 1. Insert applicant record (return id and applicant_number)
    // Normalize email: lowercase and trim
    const normalizedEmail = formData.personal.email?.trim().toLowerCase() || '';
    // Normalize phone: ensure +91 format
    const phone = formData.personal.mobileNumber?.trim() || '';
    const normalizedPhone = phone.startsWith('+91') ? phone : `+91${phone}`;

    const applicantPayload = {
      user_id: userId,
      name: formData.personal.fullName?.trim() || '',
      phone: normalizedPhone,
      email: normalizedEmail,
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

