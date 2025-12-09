# Complete System Flow Documentation - Ellure Talent Hub

## Table of Contents
1. [Overview](#overview)
2. [Authentication System](#authentication-system)
3. [User Registration Flows](#user-registration-flows)
4. [Data Flow and Storage](#data-flow-and-storage)
5. [Profile Creation Mechanism](#profile-creation-mechanism)
6. [Applicant Registration Process](#applicant-registration-process)
7. [Database Triggers and Automation](#database-triggers-and-automation)
8. [Login and Navigation Logic](#login-and-navigation-logic)
9. [Data Synchronization](#data-synchronization)
10. [Error Handling and Edge Cases](#error-handling-and-edge-cases)

---

## Overview

The Ellure Talent Hub is a multi-role recruitment management system with three main user types:
- **Applicants**: Job seekers registering and applying for positions
- **Clients**: Companies hiring talent
- **Admins**: System administrators managing the platform

The system uses **Supabase** for:
- Authentication (Auth)
- Database (PostgreSQL)
- Storage (File uploads)
- Real-time subscriptions

---

## Authentication System

### User Types and Roles

The system uses a `user_role` enum with three values:
- `applicant`
- `client`
- `admin`

### Authentication Methods

#### 1. Email/Password Authentication
- Standard email and password login
- Password requirements: Minimum 8 characters
- Email is stored in lowercase for consistency

#### 2. Phone/Password Authentication
- Phone number (10 digits) + password
- Phone format: `+91{10-digit-number}` (India country code)
- System finds email associated with phone for login

#### 3. Google OAuth
- Single Sign-On (SSO) via Google
- Automatically creates profile on first login
- Role determined from user metadata or defaults to `applicant`

---

## User Registration Flows

### 1. Applicant Registration Flow

#### Step 1: Account Creation (NEW FLOW)

**Route:** `/auth/register`

**Process:**
1. User clicks "Join as Applicant" on landing page
2. Chooses signup method:
   - **Email** → `/auth/register/email`
   - **Phone** → `/auth/register/phone`
   - **Google** → OAuth redirect

#### Step 2: Email/Phone Entry

**Routes:** `/auth/register/email` or `/auth/register/phone`

**What Happens:**
- User enters email or phone number
- Email/phone stored in `sessionStorage` temporarily
- OTP is "sent" (currently hardcoded: `123456`)
- Navigates to `/auth/register/verify-otp`

**Data Storage:** `sessionStorage`
```javascript
sessionStorage.setItem("signup_email", email)
sessionStorage.setItem("signup_phone", phone)
sessionStorage.setItem("signup_method", "email" | "phone")
```

#### Step 3: OTP Verification

**Route:** `/auth/register/verify-otp`

**What Happens:**
- User enters 6-digit OTP
- Hardcoded OTP: `123456` (temporary)
- On verification → Navigates to `/auth/register/set-password`

**Note:** In production, this will integrate with real OTP service (SMS/Email)

#### Step 4: Password Setup

**Route:** `/auth/register/set-password`

**What Happens:**
1. User sets password (min 8 characters)
2. Confirms password
3. **Account Creation Process:**
   ```javascript
   supabase.auth.signUp({
     email: email OR phone: `+91${phone}`,
     password: password,
     options: {
       data: {
         role: "applicant",
         full_name: ""
       }
     }
   })
   ```

4. **Session Check:**
   - If no session after signup → Auto sign-in with credentials
   - This handles Supabase email confirmation requirement

5. **Profile Creation:**
   - Trigger `auto_create_profile_from_auth_user` fires automatically
   - Creates profile with `role = 'applicant'`
   - If trigger fails, profile created manually in code

6. **Navigation:**
   - Clears `sessionStorage`
   - Refreshes profile in context
   - Navigates to `/auth/applicant-register/step-1`

**Data Flow:**
```
User Input → Supabase Auth → Auth User Created → Trigger Fires → Profile Created → Session Established → Redirect to Form
```

#### Step 5: Registration Form (7 Steps)

**Routes:** `/auth/applicant-register/step-1` through `/step-7`

**Authentication Required:** ✅ Yes (Protected Route)

**What Happens:**

##### Step 1: Personal Details
- **Fields:** Full Name, Mobile Number, Email, DOB, Gender, Job Role, Communication Skill
- **Storage:** `localStorage.setItem("applicant_step1", JSON.stringify(data))`
- **Navigation:** → `/auth/applicant-register/step-2`

##### Step 2: Address
- **Fields:** State, District, City, Address Line 1, Address Line 2, Pincode, Landmark
- **Dependent Dropdowns:** State → District → City
- **"Other" Option:** If city not found, user can add via RPC `add_city()`
- **Storage:** `localStorage.setItem("applicant_step2", JSON.stringify(data))`
- **Navigation:** → `/auth/applicant-register/step-3`

##### Step 3: Education
- **Fields:** Education Level, Board, Institution, Degree, Course, Percentage, Passing Year, Is Highest
- **Dynamic Fields:** Fields change based on education level selection
- **Dependent Dropdowns:** 
  - Education Level → Board/Institution options
  - Degree → Courses
  - University → Institutions
- **"Other" Options:** User can add new boards, institutions, courses via RPC functions
- **Multiple Entries:** User can add multiple education entries
- **Storage:** `localStorage.setItem("applicant_step3", JSON.stringify(data))`
- **Navigation:** → `/auth/applicant-register/step-4`

##### Step 4: Experience
- **Fields:** Company Name, Designation, Employment Type, Start Date, End Date, Is Current, CTC, Expected CTC, Notice Period, City
- **Multiple Entries:** User can add multiple experience entries
- **Calculation:** Total experience calculated in months automatically
- **Storage:** `localStorage.setItem("applicant_step4", JSON.stringify(data))`
- **Navigation:** → `/auth/applicant-register/step-5`

##### Step 5: Skills
- **Fields:** Skill Name, Skill Type, Skill Level
- **Multiple Entries:** User can add multiple skills
- **Storage:** `localStorage.setItem("applicant_step5", JSON.stringify(data))`
- **Navigation:** → `/auth/applicant-register/step-6`

##### Step 6: Documents
- **Fields:** Resume Upload, Profile Picture Upload
- **Storage Bucket:** `resumes`
- **File Path Structure:**
  ```
  resumes/
    applicants/
      {user_id}/
        resume_{timestamp}.pdf
        profile_{timestamp}.jpg
  ```
- **Storage:** File URLs stored in `localStorage` and `applicant_files` table
- **Navigation:** → `/auth/applicant-register/step-7`

##### Step 7: Review & Submit
- **Display:** Shows all entered data for review
- **Submission Process:**
  1. Calls `saveApplicantPhase2()` function
  2. Data saved to normalized tables (see Data Flow section)
  3. Success → Navigate to `/auth/applicant-register/success`

#### Step 6: Success Page

**Route:** `/auth/applicant-register/success`

**What Happens:**
- Shows success message
- User can navigate to dashboard or logout

---

### 2. Client Registration Flow

**Route:** `/auth/client` (Admin-created accounts)

**Process:**
1. Admin creates client account via admin panel
2. Auth user created with `role = 'client'` in metadata
3. Profile created via trigger `auto_create_profile_from_auth_user`
4. Client record created in `clients` table
5. Client receives credentials (email + default password)
6. Client logs in → Forced password change if required

**Data Flow:**
```
Admin Action → Auth User Created → Trigger → Profile Created → Client Record Created → Email Sent → Client Logs In
```

---

### 3. Admin Registration Flow

**Route:** `/auth/admin` (Manually created accounts)

**Process:**
1. Admin accounts created manually via Supabase dashboard or scripts
2. Auth user created with `role = 'admin'` in metadata
3. Profile created via trigger `auto_create_profile_from_auth_user`
4. Admin logs in → Full system access

**Note:** Admin accounts are typically created by system administrators, not through self-registration.

---

## Data Flow and Storage

### Applicant Registration Data Flow

#### Phase 1: Account Creation

**When:** User completes password setup

**Data Created:**

1. **Auth User** (Supabase Auth)
   ```sql
   auth.users {
     id: uuid (primary key)
     email: text
     phone: text
     encrypted_password: text
     raw_user_meta_data: {
       role: "applicant"
       full_name: ""
     }
   }
   ```

2. **Profile** (via trigger `auto_create_profile_from_auth_user`)
   ```sql
   profiles {
     id: uuid (references auth.users.id)
     email: text
     phone: text
     full_name: text
     role: 'applicant' (from metadata)
     password_changed: false
     must_change_password: false
     created_at: timestamp
     updated_at: timestamp
   }
   ```

**Order:** Auth User → Trigger Fires → Profile Created

#### Phase 2: Registration Form Submission

**When:** User completes Step 7 (Review & Submit)

**Function Called:** `saveApplicantPhase2()`

**Data Inserted (in order):**

1. **Applicants Table** (Core Record)
   ```sql
   INSERT INTO applicants {
     id: uuid (generated)
     user_id: uuid (from auth.users.id)
     name: text (from step1.fullName)
     phone: text (from step1.mobileNumber)
     email: text (from step1.email)
     state_id: uuid (from step2.stateId)
     district_id: uuid (from step2.districtId)
     city_id: uuid (from step2.cityId)
     job_role: text (from step1.jobRole)
     communication: text (from step1.communicationSkill)
     status: 'submitted'
     verified: false
     otp_verified: true
     created_at: timestamp
     updated_at: timestamp
   }
   ```

2. **Applicant Addresses Table**
   ```sql
   INSERT INTO applicant_addresses {
     id: uuid (generated)
     applicant_id: uuid (from applicants.id)
     address_line1: text (from step2.addressLine1)
     address_line2: text (from step2.addressLine2)
     pincode: text (from step2.pincode)
     landmark: text (from step2.landmark)
     created_at: timestamp
   }
   ```

3. **Applicant Education Table** (Multiple entries)
   ```sql
   INSERT INTO applicant_education {
     id: uuid (generated)
     applicant_id: uuid (from applicants.id)
     education_level: text
     board_id: uuid (nullable)
     institution_id: uuid (nullable)
     degree_id: uuid (nullable)
     course_id: uuid (nullable)
     percentage: numeric (nullable)
     passing_year: integer (nullable)
     city_id: uuid (nullable)
     state_id: uuid (nullable)
     district_id: uuid (nullable)
     is_highest: boolean
     created_at: timestamp
     updated_at: timestamp
   }
   ```

4. **Applicant Experience Table** (Multiple entries)
   ```sql
   INSERT INTO applicant_experience {
     id: uuid (generated)
     applicant_id: uuid (from applicants.id)
     company_name: text
     designation: text
     employment_type: text
     start_date: date
     end_date: date (nullable if is_current)
     is_current: boolean
     total_experience_months: integer (calculated)
     current_ctc: numeric (nullable)
     expected_ctc: numeric (nullable)
     notice_period: text (nullable)
     city_id: uuid (nullable)
     created_at: timestamp
     updated_at: timestamp
   }
   ```

5. **Applicant Skills Table** (Multiple entries)
   ```sql
   INSERT INTO applicant_skills {
     id: uuid (generated)
     applicant_id: uuid (from applicants.id)
     skill_name: text
     skill_type: text ('technical' | 'soft' | etc.)
     skill_level: text ('beginner' | 'intermediate' | 'advanced')
     created_at: timestamp
     updated_at: timestamp
   }
   ```

6. **Applicant Files Table**
   ```sql
   INSERT INTO applicant_files {
     id: uuid (generated)
     applicant_id: uuid (from applicants.id)
     file_type: enum ('resume' | 'profile_image' | 'certificate' | 'payslip' | 'id_proof' | 'other')
     file_url: text (Supabase Storage URL)
     created_at: timestamp
     updated_at: timestamp
   }
   ```

**Order of Operations:**
```
1. Insert into applicants → Get applicant_id
2. Insert into applicant_addresses (if address data exists)
3. Insert into applicant_education (if entries exist)
4. Insert into applicant_experience (if entries exist)
5. Insert into applicant_skills (if entries exist)
6. Insert into applicant_files (if files uploaded)
```

---

## Profile Creation Mechanism

### Automatic Profile Creation

Profiles are created automatically via database triggers when auth users are created.

#### Trigger: `auto_create_profile_from_auth_user`

**When:** AFTER INSERT on `auth.users`

**What It Does:**
```sql
CREATE TRIGGER auto_create_profile_from_auth_user
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION auto_create_profile_from_auth_user();

-- Function Logic:
1. Extract role from raw_user_meta_data (defaults to 'applicant')
2. Create profile with:
   - id = auth.users.id
   - email = auth.users.email
   - phone = auth.users.phone
   - full_name = from metadata
   - role = from metadata or 'applicant'
   - password_changed = false
   - must_change_password = from metadata or false
3. ON CONFLICT DO NOTHING (prevents duplicates)
```

**Order:** Auth User Created → Trigger Fires → Profile Created

### Manual Profile Creation (Fallback)

If trigger fails or profile doesn't exist, code creates it manually:

```javascript
// In SetPassword.tsx after signup
const { data: profile } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', userId)
  .single();

if (!profile) {
  await supabase.from('profiles').insert({
    id: userId,
    email: email,
    phone: phone,
    full_name: '',
    role: 'applicant'
  });
}
```

---

## Database Triggers and Automation

### 1. Profile Sync Trigger

**Trigger:** `sync_profile_from_applicant`

**When:** AFTER INSERT or UPDATE on `applicants` table

**What It Does:**
```sql
CREATE TRIGGER trg_sync_profile_on_insert
AFTER INSERT ON applicants
FOR EACH ROW
EXECUTE FUNCTION sync_profile_from_applicant();

CREATE TRIGGER trg_sync_profile_on_update
AFTER UPDATE ON applicants
FOR EACH ROW
EXECUTE FUNCTION sync_profile_from_applicant();
```

**Function Logic:**
```sql
1. Check if user_id is NULL → Return (do nothing)
2. Update profiles table:
   - full_name = applicants.name
   - phone = applicants.phone
   - email = applicants.email
   - role = 'applicant' (ALWAYS set to applicant)
   - location = formatted string from city, district, state names
3. If profile doesn't exist → Create it with role 'applicant'
```

**Purpose:** Keeps profile in sync with applicant data

**Critical:** Always sets `role = 'applicant'` to prevent role conflicts

### 2. Updated At Trigger

**Trigger:** `update_updated_at_column`

**When:** BEFORE UPDATE on various tables

**What It Does:**
```sql
CREATE TRIGGER update_applicants_updated_at
BEFORE UPDATE ON applicants
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Function sets updated_at = now()
```

**Applied To:**
- `applicants`
- `profiles`
- `applicant_education`
- `applicant_experience`
- `applicant_skills`
- `applicant_files`

---

## Login and Navigation Logic

### Login Flow

**Route:** `/auth/login`

**Process:**

1. **User Enters Credentials**
   - Email/Phone + Password
   - Or Google OAuth

2. **Authentication**
   ```javascript
   supabase.auth.signInWithPassword({
     email: email,
     password: password
   })
   ```

3. **Profile Fetch**
   - Auth context fetches profile from `profiles` table
   - Profile includes `role` field

4. **Navigation Decision**

   **For Applicants:**
   ```javascript
   // Check if applicant has completed registration
   const { data: applicant } = await supabase
     .from('applicants')
     .select('id')
     .eq('user_id', profile.id)
     .maybeSingle();
   
   if (!applicant) {
     // No applicant record → Registration incomplete
     navigate("/auth/applicant-register/step-1");
   } else {
     // Applicant record exists → Registration complete
     navigate("/dashboard/profile");
   }
   ```

   **For Clients:**
   ```javascript
   if (profile.role === 'client') {
     navigate("/dashboard/client");
   }
   ```

   **For Admins:**
   ```javascript
   if (profile.role === 'admin') {
     navigate("/dashboard/admin");
   }
   ```

### Protected Routes

**Component:** `ProtectedRoute`

**What It Does:**
- Checks if user is authenticated
- If not → Redirects to `/auth/login`
- If yes → Renders children

**Applied To:**
- All dashboard routes
- All registration form steps (step-1 through step-7)

### Role-Based Routes

**Component:** `RoleBasedRoute`

**What It Does:**
- Checks if user's role matches `allowedRoles`
- If not → Shows "Access Denied" message
- If yes → Renders children

**Example:**
```jsx
<RoleBasedRoute allowedRoles={['applicant']}>
  <ApplicantDashboard />
</RoleBasedRoute>
```

---

## Data Synchronization

### Profile ↔ Applicant Synchronization

**Direction:** Applicants → Profiles (One-way sync)

**Trigger:** `sync_profile_from_applicant`

**When Sync Happens:**
1. New applicant record inserted
2. Applicant record updated

**What Gets Synced:**
- `full_name` ← `applicants.name`
- `phone` ← `applicants.phone`
- `email` ← `applicants.email`
- `location` ← Formatted from city, district, state
- `role` ← Always set to `'applicant'`

**What Doesn't Get Synced:**
- Profile-specific fields (display_name, key_skills, etc.)
- Profile is updated, not replaced

### Why This Design?

1. **Single Source of Truth:** Applicant data is primary
2. **Profile for Display:** Profile used for dashboard display
3. **Role Consistency:** Ensures role stays `'applicant'` even if changed elsewhere

---

## Error Handling and Edge Cases

### 1. User Already Exists During Signup

**Scenario:** User tries to sign up with existing email/phone

**Handling:**
```javascript
if (error.message.includes("already registered")) {
  // Try to sign in instead
  await supabase.auth.signInWithPassword({
    email: email,
    password: password
  });
  
  // If sign-in succeeds → Continue flow
  // If sign-in fails → Show error "Account exists, use existing password"
}
```

### 2. No Session After Signup

**Scenario:** Supabase requires email confirmation, no session created

**Handling:**
```javascript
const { data, error } = await supabase.auth.signUp({...});

// Check for session
const { data: { session } } = await supabase.auth.getSession();

if (!session) {
  // Auto sign-in to create session
  await supabase.auth.signInWithPassword({
    email: email,
    password: password
  });
}
```

### 3. Profile Not Created by Trigger

**Scenario:** Trigger fails or doesn't fire

**Handling:**
```javascript
// Check if profile exists
const { data: profile } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', userId)
  .single();

if (!profile) {
  // Create manually
  await supabase.from('profiles').insert({
    id: userId,
    email: email,
    phone: phone,
    role: 'applicant'
  });
}
```

### 4. Wrong Role in Profile

**Scenario:** Profile has wrong role (e.g., 'client' instead of 'applicant')

**Handling:**
```javascript
// In sync trigger
UPDATE profiles
SET role = 'applicant'  -- ALWAYS set to applicant
WHERE id = NEW.user_id;

// In SetPassword.tsx
if (profile.role !== 'applicant') {
  await supabase
    .from('profiles')
    .update({ role: 'applicant' })
    .eq('id', userId);
}
```

### 5. Registration Form Access Without Auth

**Scenario:** User tries to access form without being logged in

**Handling:**
```javascript
// In Step1BasicInfo.tsx
useEffect(() => {
  if (!authLoading && !user) {
    navigate("/auth/register");
  }
}, [user, authLoading]);
```

### 6. Incomplete Registration on Login

**Scenario:** User logged in but hasn't completed registration

**Handling:**
```javascript
// In Login.tsx after successful login
const { data: applicant } = await supabase
  .from('applicants')
  .select('id')
  .eq('user_id', profile.id)
  .maybeSingle();

if (!applicant) {
  // Redirect to registration form
  navigate("/auth/applicant-register/step-1");
}
```

### 7. File Upload Failures

**Scenario:** File upload to Supabase Storage fails

**Handling:**
```javascript
// In Step6Upload.tsx
try {
  const { error } = await supabase.storage
    .from('resumes')
    .upload(filePath, file);
  
  if (error) {
    // Log error but continue
    console.error('File upload error:', error);
    // Show toast but don't block form submission
  }
} catch (error) {
  // Continue even if file upload fails
}
```

---

## Summary: Complete Data Flow

### New Applicant Registration

```
1. User clicks "Join as Applicant"
   ↓
2. Choose signup method (Email/Phone/Google)
   ↓
3. Enter email/phone → Verify OTP (123456)
   ↓
4. Set password → Account created
   ↓
5. Auth User Created (Supabase Auth)
   ↓
6. Trigger Fires → Profile Created (role='applicant')
   ↓
7. Session Established → Redirect to Registration Form
   ↓
8. User fills 7-step form (data in localStorage)
   ↓
9. Submit → saveApplicantPhase2() called
   ↓
10. Data inserted into normalized tables:
    - applicants (core record)
    - applicant_addresses
    - applicant_education (multiple)
    - applicant_experience (multiple)
    - applicant_skills (multiple)
    - applicant_files
   ↓
11. Trigger sync_profile_from_applicant fires
   ↓
12. Profile updated with applicant data
   ↓
13. Success → User can login and view profile
```

### Existing User Login

```
1. User enters credentials
   ↓
2. Authentication successful
   ↓
3. Profile fetched from database
   ↓
4. Check role:
   - applicant → Check if applicant record exists
     - No record → Redirect to registration form
     - Record exists → Redirect to dashboard
   - client → Redirect to client dashboard
   - admin → Redirect to admin dashboard
```

---

## Key Points to Remember

1. **Profile Created FIRST** (during account creation)
2. **Applicant Data Created LATER** (during form submission)
3. **Profile Syncs FROM Applicant** (one-way, via trigger)
4. **Role Always 'applicant'** (enforced by trigger)
5. **Session Required** (for all protected routes)
6. **Registration Check** (on login, redirects if incomplete)

---

## Database Tables Summary

### Core Tables
- `profiles` - User profiles (created first)
- `applicants` - Applicant core data (created during form submission)
- `clients` - Client records
- `users` (auth.users) - Authentication data

### Normalized Tables
- `applicant_addresses` - Address details
- `applicant_education` - Education entries (multiple)
- `applicant_experience` - Experience entries (multiple)
- `applicant_skills` - Skills entries (multiple)
- `applicant_files` - File uploads

### Master Data Tables
- `states` - Indian states
- `districts` - Districts within states
- `cities` - Cities within districts
- `boards` - Education boards
- `institutions` - Educational institutions
- `universities` - Universities
- `degrees` - Degree types
- `courses` - Course names

---

## File Storage

### Storage Bucket: `resumes`

### File Structure:
```
resumes/
  applicants/
    {user_id}/
      resume_{timestamp}.pdf
      profile_{timestamp}.jpg
```

### File Types:
- `resume` - Resume/CV files
- `profile_image` - Profile pictures
- `certificate` - Certificates
- `payslip` - Payslips
- `id_proof` - ID proofs
- `other` - Other documents

---

## RPC Functions

### Master Data Addition

1. **add_city** - Add new city
   ```sql
   add_city(p_city_type, p_district_id, p_name, p_state_id)
   ```

2. **add_institution** - Add new institution
   ```sql
   add_institution(p_name, p_type, p_state_id, p_district_id, p_city_id, p_university_id, p_address)
   ```

3. **add_course** - Add new course
   ```sql
   add_course(p_name, p_degree_id, p_category)
   ```

4. **add_board** - Add new board
   ```sql
   add_board(p_name, p_state_id)
   ```

---

## Security Considerations

1. **Password Requirements:** Minimum 8 characters
2. **Email Validation:** Standard email format
3. **Phone Validation:** 10-digit Indian phone numbers
4. **Protected Routes:** All dashboard routes require authentication
5. **Role-Based Access:** Routes check user role before access
6. **File Upload Validation:** File type and size validation
7. **SQL Injection Prevention:** Parameterized queries via Supabase
8. **XSS Prevention:** React's built-in escaping

---

## Future Enhancements

1. **Real OTP Service:** Replace hardcoded `123456` with SMS/Email OTP
2. **Email Verification:** Require email confirmation before form access
3. **Progress Persistence:** Save form progress to database (not just localStorage)
4. **Resume Parsing:** Auto-fill form from uploaded resume
5. **Multi-step Validation:** Validate each step before allowing next
6. **Draft Saving:** Auto-save form progress periodically
7. **Password Reset:** Forgot password functionality
8. **Two-Factor Authentication:** Additional security layer

---

## Troubleshooting Guide

### Issue: User can't access registration form
**Solution:** Check if user is authenticated. Redirect to `/auth/register` if not.

### Issue: Profile has wrong role
**Solution:** Run `scripts/fixProfileRolePermanently.sql` to fix all profiles.

### Issue: Applicant data not syncing to profile
**Solution:** Check if trigger `sync_profile_from_applicant` exists and is enabled.

### Issue: File upload fails
**Solution:** Check Supabase Storage bucket permissions and file size limits.

### Issue: Login redirects to wrong page
**Solution:** Check if applicant record exists. If not, redirect to registration form.

---

**Last Updated:** 2024
**Version:** 2.0
**Maintained By:** Development Team










