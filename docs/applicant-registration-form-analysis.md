# Applicant Registration Form - Complete Analysis

## 📊 Applicants Table - All 47 Columns

### Core Identity Fields (Required)
1. **id** (uuid) - Primary key, auto-generated
2. **user_id** (uuid) - Links to profiles.id (auto-created by trigger)
3. **client_id** (uuid) - Optional, for client-specific applicants
4. **name** (text) - **REQUIRED** - Full name
5. **phone** (text) - **REQUIRED** - Mobile number
6. **email** (text) - **REQUIRED** - Email address
7. **city** (text) - **REQUIRED** - Current city/location

### Skills & Job Details
8. **skill** (text) - Skill/job role
9. **communication** (text) - Communication skill rating
10. **job_role** (text) - Job role applying for

### Education Fields
11. **education_level** (text) - Highest qualification (10th, 12th, Graduation, etc.)
12. **education_board** (text) - Education board (CBSE, ICSE, State Board, etc.)
13. **medium** (text) - Medium of study (English, Hindi, etc.)
14. **course_degree** (text) - Course/degree name
15. **university** (text) - University/institute name
16. **percentage** (text) - Percentage/grade
17. **passing_year** (integer) - Year of passing

### Experience Fields
18. **experience_type** (text) - Fresher or Experienced
19. **total_experience** (text) - Total years of experience
20. **current_company** (text) - Current company name
21. **current_designation** (text) - Current job title
22. **current_ctc** (text) - Current salary
23. **expected_ctc** (text) - Expected salary

### Additional Details
24. **key_skills** (text) - Comma-separated or JSON skills
25. **notice_period** (text) - Notice period duration
26. **availability** (text) - Availability status

### Files
27. **resume_file** (text) - Resume file path/URL
28. **profile_image** (text) - Profile picture path/URL

### Status & Verification
29. **status** (text) - Default: 'submitted'
30. **verified** (boolean) - Default: false
31. **otp_verified** (boolean) - Default: false
32. **remarks** (text) - Admin remarks

### Metadata
33. **registration_date** (timestamp) - Auto-set to now()
34. **profile_complete_percent** (integer) - Default: 0
35. **is_deleted** (boolean) - Soft delete flag
36. **deleted_at** (timestamp) - Deletion timestamp
37. **created_at** (timestamp) - Auto-set to now()
38. **updated_at** (timestamp) - Auto-updated by trigger

### Legacy/Duplicate Fields (for backward compatibility)
39. **date** (text) - Legacy date field
40. **full_name** (text) - Duplicate of name
41. **mobile_number** (text) - Duplicate of phone
42. **email_address** (text) - Duplicate of email
43. **city_current_location** (text) - Duplicate of city
44. **skill_job_role_applying_for** (text) - Duplicate of job_role
45. **highest_qualification** (text) - Duplicate of education_level
46. **medium_of_study** (text) - Duplicate of medium
47. **course_degree_name** (text) - Duplicate of course_degree
48. **university_institute_name** (text) - Duplicate of university
49. **year_of_passing** (text) - Duplicate of passing_year
50. **work_experience** (text) - Duplicate of experience_type
51. **total_experience_numbers** (text) - Duplicate of total_experience
52. **exp_ctc** (text) - Duplicate of expected_ctc
53. **key_skill** (text) - Duplicate of key_skills
54. **upload_cv_any_format** (text) - Duplicate of resume_file
55. **education** (text) - General education field

---

## 🔄 Current Form Structure

### ✅ YES, it IS a Multi-Step Form (4 Steps)

**Step 1: Basic Information** (`Step1BasicInfo.tsx`)
- Full Name
- Mobile Number (with OTP verification)
- Email
- Current City (text input - needs dropdown)
- Job Role (dropdown)
- Communication Skill (radio buttons)

**Step 2: Education Details** (`Step2Education.tsx`)
- Highest Qualification (dropdown)
- Education Board (dropdown)
- Medium of Study (dropdown)
- Course/Degree Name (text input)
- University/Institute (text input - needs dropdown with city-based filtering)
- Percentage/Grade (dropdown)
- Year of Passing (dropdown)

**Step 3: Professional Details** (`Step3Professional.tsx`)
- Work Experience (Fresher/Experienced - radio)
- Conditional fields for Experienced:
  - Total Experience
  - Current Company
  - Current Designation
  - Current CTC
  - Expected CTC
- Key Skills (tag input with suggestions)

**Step 4: Upload Documents** (`Step4Upload.tsx`)
- Resume Upload (required)
- Profile Picture Upload (optional)
- Confirmation checkbox

**Success Page** (`RegistrationSuccess.tsx`)
- ✅ Already exists
- Shows success message
- Links to dashboard

---

## ❌ Current Issues & Missing Features

### 1. **No State/City Dropdowns**
- Currently uses text input for city
- Need: State dropdown → City dropdown (cascading)

### 2. **No Conditional Education Fields**
- Doesn't show different fields based on qualification level
- Need: 
  - If 12th → Show Stream dropdown
  - If Graduation → Show Course dropdown + CGPA/SGPA input
  - If Post-Graduation → Show Course dropdown + CGPA/SGPA input

### 3. **No College/University Dropdown**
- Currently uses text input
- Need: City-based college dropdown with "Other" option to type

### 4. **Not Saving to Supabase**
- Currently saves to `localStorage` only
- Need: Save to `applicants` table in Supabase

### 5. **No Address Fields**
- Missing: Full address, State, Pincode
- Need: Complete address section

### 6. **Profile Auto-Creation**
- ✅ Already works via trigger `trg_auto_create_profile_from_applicant`
- But form needs to actually save to database first

---

## ✅ What Needs to Be Implemented

### Enhanced Multi-Step Form Structure:

**Step 1: Personal Information**
- Full Name
- Mobile Number (OTP verification)
- Email
- **State** (dropdown) → **City** (dropdown based on state)
- **Full Address** (textarea)
- **Pincode** (text input)
- Job Role (dropdown)
- Communication Skill (radio)

**Step 2: Education Details** (Conditional Logic)
- Highest Qualification (dropdown)
  - **If 10th/12th:**
    - Education Board
    - Medium of Study
    - **Stream** (Science/Commerce/Arts) - for 12th only
    - Percentage/Grade
    - Year of Passing
  - **If Graduation/Post-Graduation:**
    - Course/Degree Name (dropdown with search)
    - **University/College** (dropdown based on city, with "Other" option)
    - **CGPA/SGPA** (radio: CGPA or SGPA) → Input field
    - Year of Passing
  - **If Diploma:**
    - Course Name
    - Institute Name (dropdown based on city)
    - Percentage
    - Year of Passing

**Step 3: Professional Details**
- Work Experience (Fresher/Experienced)
- Conditional fields for Experienced
- Key Skills (tag input)

**Step 4: Upload & Submit**
- Resume Upload
- Profile Picture Upload
- Confirmation
- **Submit to Supabase** → Show success → Redirect to profile

---

## 🎯 Implementation Plan

1. **Create State/City Data**
   - JSON file with Indian states and cities
   - Component for cascading dropdowns

2. **Create College/University Data**
   - JSON file with colleges by city
   - Searchable dropdown with "Other" option

3. **Add Conditional Logic**
   - React state to show/hide fields based on qualification
   - Different validation schemas per qualification level

4. **Integrate Supabase**
   - Replace localStorage with Supabase insert
   - Handle file uploads to Supabase Storage
   - Show loading states

5. **Update Success Page**
   - Show "Building your profile..." message
   - Redirect to `/dashboard/profile` after profile creation

6. **Profile Auto-Creation**
   - ✅ Already handled by database trigger
   - Just need to ensure applicant record is saved correctly

---

## 📝 Database Triggers (Already Working)

1. **`trg_auto_create_profile_from_applicant`** (AFTER INSERT/UPDATE)
   - Automatically creates/updates profile when applicant is created/updated
   - Links `applicants.user_id` to `profiles.id`

2. **`trg_auto_update_profile_on_applicant_insert`** (AFTER INSERT)
   - Updates profile with applicant data

3. **`trg_auto_update_profile_on_applicant_update`** (AFTER UPDATE)
   - Syncs profile when applicant is updated

**So once we save to `applicants` table, the profile will be created automatically!** ✅

---

## 🔧 Next Steps

1. Create state/city data files
2. Create college/university data files
3. Update Step 1 with address fields and state/city dropdowns
4. Update Step 2 with conditional logic and college dropdowns
5. Integrate Supabase save functionality
6. Update success page with redirect to profile
7. Test end-to-end flow











