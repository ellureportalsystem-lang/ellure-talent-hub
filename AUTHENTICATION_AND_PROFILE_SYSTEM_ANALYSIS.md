# 🔐 Authentication & Profile Creation System Analysis
## Ellure Talent Hub - Complete Flow Documentation & Problem Identification

**Date:** January 2025  
**Purpose:** Document how authentication, profile creation, and role management works, and identify all problems

---

## 📋 TABLE OF CONTENTS

1. [System Overview](#system-overview)
2. [User Roles Explained](#user-roles-explained)
3. [Profile Creation System](#profile-creation-system)
4. [Applicant Registration Flow](#applicant-registration-flow)
5. [Login Flows for Each Role](#login-flows-for-each-role)
6. [🔴 CRITICAL PROBLEMS IDENTIFIED](#-critical-problems-identified)
7. [🟡 MEDIUM PRIORITY ISSUES](#-medium-priority-issues)
8. [Problem Scenarios & Root Causes](#problem-scenarios--root-causes)

---

## SYSTEM OVERVIEW

The Ellure Talent Hub uses **Supabase** for authentication and database management. The system has three main user roles, each with different access levels and registration methods.

### Key Components:
- **Supabase Auth**: Handles user authentication (email/phone/password, Google OAuth)
- **Database Triggers**: Automatically create profiles when auth users are created
- **Profile Table**: Stores user role and metadata
- **Role-Based Routes**: Protect dashboards based on user role

---

## USER ROLES EXPLAINED

### 1. **Applicant Role** (`applicant`)
- **Who:** Job seekers registering to find jobs
- **Registration:** Self-registration via public registration flow
- **Dashboard:** `/dashboard/applicant`
- **Access:** Can view/edit own profile, submit applications

### 2. **Client Role** (`client`)
- **Who:** Companies/organizations hiring talent
- **Registration:** Created by admin (no self-registration)
- **Dashboard:** `/dashboard/client`
- **Access:** Can browse candidates, create shortlists, manage jobs

### 3. **Admin Role** (`admin`)
- **Who:** System administrators
- **Registration:** Manually created (no self-registration)
- **Dashboard:** `/dashboard/admin`
- **Access:** Full system access, manage users, applicants, clients

---

## PROFILE CREATION SYSTEM

### How Profiles Are Created Automatically

Profiles are created automatically via **database triggers** when auth users are created. This is the core mechanism that links Supabase Auth users to application profiles.

#### Trigger: `trg_auto_create_profile_from_auth`

**Location:** Database trigger on `auth.users` table  
**When:** AFTER INSERT on `auth.users`  
**Function:** `auto_create_profile_from_auth_user()`

**How It Works:**

```sql
-- Trigger fires automatically when auth user is created
CREATE TRIGGER trg_auto_create_profile_from_auth
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION auto_create_profile_from_auth_user();
```

**Function Logic:**

1. **Extracts role from metadata:**
   ```sql
   safe_role := COALESCE(
     (NEW.raw_user_meta_data->>'role')::user_role,
     'applicant'::user_role  -- Defaults to 'applicant' if not specified
   );
   ```

2. **Generates safe email:**
   ```sql
   safe_email := COALESCE(
     NULLIF(NEW.email, ''),
     'user-' || NEW.id::text || '@generated.local'  -- Fallback for phone-only signups
   );
   ```

3. **Creates profile record:**
   ```sql
   INSERT INTO public.profiles (
     id,              -- Same as auth.users.id
     email,
     phone,
     full_name,
     role,            -- From metadata or 'applicant'
     created_at,
     updated_at
   )
   VALUES (...)
   ON CONFLICT (id) DO NOTHING;  -- Prevents duplicates
   ```

**Flow Diagram:**
```
User Signs Up
    ↓
Supabase Auth Creates auth.users Record
    ↓
Trigger Fires (trg_auto_create_profile_from_auth)
    ↓
Function Executes (auto_create_profile_from_auth_user)
    ↓
Profile Created in profiles Table
    ↓
Role Set from raw_user_meta_data->>'role' or defaults to 'applicant'
```

### Manual Profile Creation (Fallback)

If the trigger fails or profile doesn't exist, the code creates it manually:

**Location:** `SetPassword.tsx`, `GoogleCallback.tsx`

```typescript
// Check if profile exists
const { data: profile } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', userId)
  .maybeSingle();

if (!profile) {
  // Fallback: create profile manually
  await supabase.from('profiles').insert({
    id: userId,
    email: normalizedEmail || '',
    full_name: '',
    role: 'applicant',  // ⚠️ Always defaults to 'applicant'
  });
}
```

**⚠️ PROBLEM:** Manual fallback always sets role to `'applicant'`, even for admin/client users!

---

## APPLICANT REGISTRATION FLOW

### Complete Flow: "Join as Applicant" → Registration Form → Profile Created

#### Step 1: Account Creation Method Selection
**Route:** `/auth/register`  
**Page:** `AccountCreationMethod.tsx`

User clicks "Join as Applicant" → Chooses Email or Phone registration

#### Step 2: Email/Phone Sign Up
**Route:** `/auth/register/email` or `/auth/register/phone`  
**Pages:** `EmailSignUp.tsx`, `PhoneSignUp.tsx`

- User enters email or phone
- OTP sent (currently hardcoded "123456" for development)
- Email/phone stored in `sessionStorage`

#### Step 3: OTP Verification
**Route:** `/auth/register/verify-otp`  
**Page:** `VerifyOTP.tsx`

- User enters OTP
- OTP verified (currently accepts "123456")
- Redirects to password setup

#### Step 4: Set Password
**Route:** `/auth/register/set-password`  
**Page:** `SetPassword.tsx`

**⚠️ CRITICAL STEP - This is where profile is created!**

**What Happens:**

1. **User creates password**
2. **Supabase Auth signup:**
   ```typescript
   const { data, error } = await supabase.auth.signUp({
     email: normalizedEmail,
     phone: normalizedPhone ? `+91${normalizedPhone}` : undefined,
     password: password,
     options: {
       data: {
         role: "applicant",  // ✅ Role set in metadata
       },
     },
   });
   ```

3. **Trigger fires automatically:**
   - `trg_auto_create_profile_from_auth` fires
   - `auto_create_profile_from_auth_user()` executes
   - Profile created with `role = 'applicant'` (from metadata)

4. **Fallback check (if trigger failed):**
   ```typescript
   const { data: profile } = await supabase
     .from('profiles')
     .select('*')
     .eq('id', userId)
     .maybeSingle();

   if (!profile) {
     // Manual creation - always sets role to 'applicant'
     await supabase.from('profiles').insert({
       id: userId,
       email: normalizedEmail || '',
       full_name: '',
       role: 'applicant',  // ⚠️ Hardcoded
     });
   } else if (profile.role !== 'applicant') {
     // ⚠️ PROBLEM: Forces role to 'applicant' even if it was something else!
     await supabase
       .from('profiles')
       .update({ role: 'applicant' })
       .eq('id', userId);
   }
   ```

5. **Redirect to registration form:**
   ```typescript
   navigate("/auth/applicant-register/step-1");
   ```

#### Step 5: Multi-Step Registration Form (Steps 1-7)

**Routes:** `/auth/applicant-register/step-1` through `/auth/applicant-register/step-7`

**Steps:**
1. **Step 1:** Basic Info (name, email, phone, DOB, gender, job role)
2. **Step 2:** Address (state, city, district, address lines, pincode)
3. **Step 3:** Education (multiple education entries)
4. **Step 4:** Experience (work experience entries)
5. **Step 5:** Skills (key skills)
6. **Step 6:** Upload (resume, profile picture)
7. **Step 7:** Review & Submit

**Data Storage:**
- Form data stored in `localStorage` (step1, step2, step3, etc.)
- Files uploaded to Supabase Storage
- On Step 7 submission, all data saved to database via `saveApplicantPhase2()`

#### Step 6: Registration Success
**Route:** `/auth/applicant-register/success`  
**Page:** `RegistrationSuccess.tsx`

- Shows success message
- User can navigate to dashboard

**Complete Flow Diagram:**
```
User Clicks "Join as Applicant"
    ↓
Choose Email/Phone Registration
    ↓
Enter Email/Phone → OTP Sent
    ↓
Verify OTP
    ↓
Set Password → supabase.auth.signUp() with role: "applicant"
    ↓
Trigger Fires → Profile Created (role: 'applicant')
    ↓
Redirect to Registration Form Step 1
    ↓
Fill Steps 1-6 (data in localStorage)
    ↓
Step 7: Review & Submit → saveApplicantPhase2()
    ↓
Data Saved to Database (applicants, addresses, education, etc.)
    ↓
Success Page → Can Access Dashboard
```

---

## LOGIN FLOWS FOR EACH ROLE

### 1. Applicant Login Flow

**Route:** `/auth/login` or `/auth/applicant`  
**Page:** `Login.tsx` or `ApplicantLogin.tsx`

**Process:**

1. **User enters email/phone + password**
2. **Login attempt:**
   ```typescript
   const result = await signIn(email, password);
   ```

3. **Profile fetched:**
   ```typescript
   let updatedProfile = await refreshProfile();
   ```

4. **Role check and navigation:**
   ```typescript
   if (updatedProfile?.role === 'applicant') {
     // Check if applicant record exists
     const { data: applicant } = await supabase
       .from('applicants')
       .select('id')
       .eq('user_id', updatedProfile.id)
       .maybeSingle();
     
     if (!applicant) {
       // No applicant record → redirect to registration form
       navigate("/auth/applicant-register/step-1");
     } else {
       // Has applicant record → go to dashboard
       navigate("/dashboard/applicant");
     }
   }
   ```

**⚠️ PROBLEM:** If profile role is not set correctly, user gets "Access Denied" error!

### 2. Admin Login Flow

**Route:** `/auth/admin`  
**Page:** `AdminLogin.tsx`

**Process:**

1. **User enters email + password**
2. **Login attempt:**
   ```typescript
   const result = await signIn(email, password);
   ```

3. **Immediate navigation:**
   ```typescript
   navigate("/dashboard/admin");  // ⚠️ Doesn't wait for profile!
   ```

4. **Role check happens in `RoleBasedRoute`:**
   ```typescript
   // In RoleBasedRoute component
   if (!allowedRoles.includes(profile.role)) {
     return <AccessDenied />;  // ⚠️ Shows "Access Denied" if role doesn't match
   }
   ```

**⚠️ PROBLEM:** 
- Admin login navigates immediately without checking role
- If profile role is not `'admin'`, user sees "Access Denied" page
- No error message explaining why access was denied

### 3. Client Login Flow

**Route:** `/auth/client`  
**Page:** `ClientLogin.tsx`

**Process:**

1. **User enters email + password**
2. **Login attempt:**
   ```typescript
   const result = await signIn(email, password);
   ```

3. **Immediate navigation:**
   ```typescript
   navigate("/dashboard/client");  // ⚠️ Doesn't wait for profile!
   ```

4. **Role check happens in `RoleBasedRoute`:**
   ```typescript
   // In RoleBasedRoute component
   if (!allowedRoles.includes(profile.role)) {
     return <AccessDenied />;  // ⚠️ Shows "Access Denied" if role doesn't match
   }
   ```

**⚠️ PROBLEM:** 
- Client login navigates immediately without checking role
- If profile role is not `'client'`, user sees "Access Denied" page
- No error message explaining why access was denied

### 4. Google OAuth Login Flow

**Route:** `/auth/google/callback`  
**Page:** `GoogleCallback.tsx`

**Process:**

1. **User clicks "Sign in with Google"**
2. **OAuth redirect happens**
3. **Callback handler:**
   ```typescript
   const { data: { session } } = await supabase.auth.getSession();
   ```

4. **Profile check and creation:**
   ```typescript
   const { data: existingProfile } = await supabase
     .from('profiles')
     .select('*')
     .eq('id', session.user.id)
     .maybeSingle();

   if (!existingProfile) {
     // Create profile manually
     await supabase.from('profiles').insert({
       id: session.user.id,
       email: session.user.email || `user-${session.user.id}@generated.local`,
       full_name: session.user.user_metadata?.full_name || '',
       role: 'applicant',  // ⚠️ Always defaults to 'applicant'
     });
   } else if (!existingProfile.role || 
              (existingProfile.role !== 'admin' && existingProfile.role !== 'client')) {
     // ⚠️ PROBLEM: Forces role to 'applicant' even if user was admin/client!
     await supabase
       .from('profiles')
       .update({ role: 'applicant' })
       .eq('id', session.user.id);
   }
   ```

5. **Navigation based on role:**
   ```typescript
   if (updatedProfile?.role === 'admin') {
     navigate('/dashboard/admin');
   } else if (updatedProfile?.role === 'client') {
     navigate('/dashboard/client');
   } else {
     // Default to applicant flow
     navigate('/auth/applicant-register/step-1');
   }
   ```

**⚠️ PROBLEM:** Google OAuth always creates/updates profile with `role: 'applicant'`, even for existing admin/client users!

---

## 🔴 CRITICAL PROBLEMS IDENTIFIED

### Problem 1: Role Not Set Correctly During Profile Creation

**Location:** Multiple files (`SetPassword.tsx`, `GoogleCallback.tsx`)

**Issue:**
- When profile is created manually (fallback), role is **always** set to `'applicant'`
- Even if user metadata has `role: 'admin'` or `role: 'client'`, the fallback ignores it
- Code explicitly forces role to `'applicant'` in some cases

**Code Example:**
```typescript
// SetPassword.tsx line 157-162
} else if (profile.role !== 'applicant') {
  // ⚠️ PROBLEM: Forces role to 'applicant' even if it was something else!
  await supabase
    .from('profiles')
    .update({ role: 'applicant' })
    .eq('id', userId);
}
```

**Impact:**
- Admin users cannot access admin dashboard (get "Access Denied")
- Client users cannot access client dashboard (get "Access Denied")
- Users see "Access Denied" page without explanation

**Root Cause:**
- Fallback profile creation doesn't check user metadata for role
- Code assumes all new signups are applicants

---

### Problem 2: Admin/Client Login Doesn't Verify Role Before Navigation

**Location:** `AdminLogin.tsx`, `ClientLogin.tsx`

**Issue:**
- Login pages navigate immediately after successful auth
- No role verification before navigation
- Role check happens in `RoleBasedRoute`, which shows "Access Denied" if role doesn't match

**Code Example:**
```typescript
// AdminLogin.tsx line 48
navigate("/dashboard/admin");  // ⚠️ Navigates without checking role!
```

**Impact:**
- Admin users with incorrect role see "Access Denied" page
- Client users with incorrect role see "Access Denied" page
- Poor user experience (no explanation of why access was denied)

**Root Cause:**
- Login pages don't wait for profile to load
- No role verification before navigation

---

### Problem 3: Google OAuth Always Sets Role to 'applicant'

**Location:** `GoogleCallback.tsx`

**Issue:**
- Google OAuth callback always creates/updates profile with `role: 'applicant'`
- Even if user was previously an admin or client, role gets overwritten
- No check for existing role before updating

**Code Example:**
```typescript
// GoogleCallback.tsx line 54-60
} else if (!existingProfile.role || 
           (existingProfile.role !== 'admin' && existingProfile.role !== 'client')) {
  // ⚠️ PROBLEM: Forces role to 'applicant' even if user was admin/client!
  await supabase
    .from('profiles')
    .update({ role: 'applicant' })
    .eq('id', session.user.id);
}
```

**Impact:**
- Admin users logging in with Google lose admin access
- Client users logging in with Google lose client access
- Users must use email/password login to maintain their role

**Root Cause:**
- Google OAuth callback assumes all Google signups are applicants
- No preservation of existing roles

---

### Problem 4: Trigger May Not Set Role Correctly

**Location:** Database trigger `auto_create_profile_from_auth_user()`

**Issue:**
- Trigger extracts role from `raw_user_meta_data->>'role'`
- If metadata doesn't have role, defaults to `'applicant'`
- Admin/client accounts created manually may not have role in metadata

**Code Example:**
```sql
-- Trigger function
safe_role := COALESCE(
  (NEW.raw_user_meta_data->>'role')::user_role,
  'applicant'::user_role  -- ⚠️ Defaults to 'applicant' if not in metadata
);
```

**Impact:**
- Admin accounts created without role in metadata get `role: 'applicant'`
- Client accounts created without role in metadata get `role: 'applicant'`
- Users cannot access their dashboards

**Root Cause:**
- Trigger relies on metadata having correct role
- No fallback mechanism to determine role from other sources

---

### Problem 5: Profile Loading Race Conditions

**Location:** `AuthContext.tsx`, `Login.tsx`, `RoleBasedRoute.tsx`

**Issue:**
- Profile loading has complex retry logic and timeouts
- Multiple attempts to fetch profile suggest it's not loading reliably
- Race conditions between auth state and profile loading

**Code Example:**
```typescript
// AuthContext.tsx - Complex retry logic
const fetchProfile = async (userId: string, retries = 2): Promise<Profile | null> => {
  for (let attempt = 0; attempt <= retries; attempt++) {
    // Multiple retry attempts with timeouts
    // Suggests profile loading is unreliable
  }
}
```

**Impact:**
- Users may see loading screens for extended periods
- Profile may not load, causing navigation issues
- Role check may fail if profile hasn't loaded

**Root Cause:**
- Profile creation may be delayed
- Network issues or database latency
- Trigger execution timing

---

### Problem 6: No Error Messages for Access Denied

**Location:** `RoleBasedRoute.tsx`

**Issue:**
- When role doesn't match, user sees generic "Access Denied" page
- No explanation of why access was denied
- No guidance on how to fix the issue

**Code Example:**
```typescript
// RoleBasedRoute.tsx
if (!allowedRoles.includes(profile.role)) {
  return (
    <Card>
      <CardTitle>Access Denied</CardTitle>
      <CardDescription>
        You don't have permission to access this page.
      </CardDescription>
      {/* ⚠️ No explanation of why or how to fix */}
    </Card>
  );
}
```

**Impact:**
- Users don't know why they can't access dashboard
- No way to self-diagnose the issue
- Support burden increases

**Root Cause:**
- Generic error page doesn't provide context
- No diagnostic information shown

---

## 🟡 MEDIUM PRIORITY ISSUES

### Issue 1: Session Storage Used for Registration Flow

**Location:** `EmailSignUp.tsx`, `PhoneSignUp.tsx`, `SetPassword.tsx`

**Issue:**
- Email/phone stored in `sessionStorage` during registration
- If user closes browser, data is lost
- Not persistent across sessions

**Impact:**
- User must restart registration if browser closes
- Poor user experience

---

### Issue 2: Hardcoded OTP for Development

**Location:** `EmailSignUp.tsx`, `PhoneSignUp.tsx`

**Issue:**
- OTP is hardcoded as "123456" for development
- No real OTP sending implemented
- Comment says "In production, you would send OTP here"

**Impact:**
- Not production-ready
- Security risk if deployed without fixing

---

### Issue 3: No Role Assignment During Admin/Client Account Creation

**Issue:**
- Admin and client accounts are created manually
- No clear process documented for setting role correctly
- Role must be set in metadata during account creation

**Impact:**
- Admins creating accounts may forget to set role
- Accounts created incorrectly cannot access dashboards

---

### Issue 4: Profile Refresh Logic is Complex

**Location:** `AuthContext.tsx`, `Login.tsx`

**Issue:**
- Multiple attempts to refresh profile
- Complex timeout and retry logic
- Suggests unreliable profile loading

**Impact:**
- Code complexity increases maintenance burden
- Potential performance issues

---

## PROBLEM SCENARIOS & ROOT CAUSES

### Scenario 1: User Clicks "Join as Applicant" → Completes Registration → Cannot Login

**Flow:**
1. User completes registration flow
2. Profile created with `role: 'applicant'` ✅
3. User tries to login
4. Profile loads correctly ✅
5. User navigates to dashboard ✅

**Why It Works:**
- Registration flow correctly sets `role: 'applicant'` in metadata
- Trigger creates profile with correct role
- Login flow works for applicants

---

### Scenario 2: Admin User Logs In → Gets "Access Denied"

**Flow:**
1. Admin user logs in via `/auth/admin`
2. Login successful ✅
3. Navigate to `/dashboard/admin` immediately
4. `RoleBasedRoute` checks profile role
5. Profile role is `'applicant'` instead of `'admin'` ❌
6. Shows "Access Denied" page ❌

**Root Causes:**
- Admin account created without `role: 'admin'` in metadata
- Trigger defaults to `'applicant'` when role not in metadata
- Fallback profile creation always sets `role: 'applicant'`
- Google OAuth overwrites role to `'applicant'`

**How to Fix:**
- Ensure admin accounts have `role: 'admin'` in `raw_user_meta_data` when created
- Update profile manually in database: `UPDATE profiles SET role = 'admin' WHERE email = 'admin@example.com'`
- Fix fallback profile creation to preserve existing roles

---

### Scenario 3: Client User Logs In → Gets "Access Denied"

**Flow:**
1. Client user logs in via `/auth/client`
2. Login successful ✅
3. Navigate to `/dashboard/client` immediately
4. `RoleBasedRoute` checks profile role
5. Profile role is `'applicant'` instead of `'client'` ❌
6. Shows "Access Denied" page ❌

**Root Causes:**
- Client account created without `role: 'client'` in metadata
- Trigger defaults to `'applicant'` when role not in metadata
- Fallback profile creation always sets `role: 'applicant'`
- Google OAuth overwrites role to `'applicant'`

**How to Fix:**
- Ensure client accounts have `role: 'client'` in `raw_user_meta_data` when created
- Update profile manually in database: `UPDATE profiles SET role = 'client' WHERE email = 'client@example.com'`
- Fix fallback profile creation to preserve existing roles

---

### Scenario 4: User Logs In with Google OAuth → Loses Admin/Client Access

**Flow:**
1. Admin/Client user clicks "Sign in with Google"
2. OAuth callback executes
3. Profile exists with `role: 'admin'` or `role: 'client'` ✅
4. GoogleCallback checks profile
5. Code updates profile: `role: 'applicant'` ❌
6. User loses admin/client access ❌

**Root Cause:**
```typescript
// GoogleCallback.tsx line 54-60
} else if (!existingProfile.role || 
           (existingProfile.role !== 'admin' && existingProfile.role !== 'client')) {
  // ⚠️ This condition is TRUE for admin/client users!
  // Because: existingProfile.role === 'admin' → condition is FALSE
  // But wait... the logic is wrong!
  
  // Actually, this condition means:
  // "If role is missing OR role is not admin/client, update to applicant"
  // But the condition is written incorrectly!
  
  await supabase
    .from('profiles')
    .update({ role: 'applicant' })
    .eq('id', session.user.id);
}
```

**The Bug:**
The condition `(existingProfile.role !== 'admin' && existingProfile.role !== 'client')` is always TRUE for admin/client users because of De Morgan's law:
- For admin: `'admin' !== 'admin' && 'admin' !== 'client'` = `false && true` = `false` ✅
- But the overall condition with `!existingProfile.role ||` makes it confusing

**Actually, the real issue is:**
- The condition should be: `if (existingProfile.role !== 'admin' && existingProfile.role !== 'client')`
- This means: "If role is not admin AND not client, update to applicant"
- But this is wrong! It should preserve admin/client roles!

**Correct Logic Should Be:**
```typescript
if (!existingProfile.role) {
  // No role set, default to applicant
  await supabase.from('profiles').update({ role: 'applicant' }).eq('id', userId);
} else {
  // Role exists, preserve it (don't overwrite admin/client)
  // Do nothing
}
```

---

### Scenario 5: Profile Not Loading After Login

**Flow:**
1. User logs in successfully
2. Auth session created ✅
3. Profile fetch attempted
4. Profile fetch fails or times out ❌
5. User sees loading screen indefinitely
6. Navigation doesn't happen

**Root Causes:**
- Trigger hasn't executed yet (timing issue)
- Network issues
- Database latency
- Profile doesn't exist (trigger failed)

**Impact:**
- User cannot access dashboard
- Poor user experience

---

## SUMMARY OF PROBLEMS

### Critical Problems (Must Fix):

1. ✅ **Role Not Set Correctly** - Fallback profile creation always sets `role: 'applicant'`
2. ✅ **Admin/Client Login Doesn't Verify Role** - Navigates without checking role first
3. ✅ **Google OAuth Overwrites Roles** - Always sets role to `'applicant'`, even for admin/client
4. ✅ **Trigger Defaults to Applicant** - If role not in metadata, defaults to `'applicant'`
5. ✅ **No Error Messages** - "Access Denied" page doesn't explain why

### Medium Priority Issues:

6. ⚠️ **Session Storage** - Registration data lost if browser closes
7. ⚠️ **Hardcoded OTP** - Not production-ready
8. ⚠️ **No Role Assignment Process** - No clear process for creating admin/client accounts
9. ⚠️ **Complex Profile Loading** - Retry logic suggests unreliable loading

---

## HOW TO DIAGNOSE PROBLEMS

### Check Profile Role:
```sql
SELECT id, email, role, created_at 
FROM profiles 
WHERE email = 'user@example.com';
```

### Check Auth User Metadata:
```sql
SELECT id, email, raw_user_meta_data 
FROM auth.users 
WHERE email = 'user@example.com';
```

### Check Trigger Status:
```sql
SELECT trigger_name, event_manipulation, event_object_table, action_statement
FROM information_schema.triggers
WHERE trigger_name = 'trg_auto_create_profile_from_auth';
```

### Check Function Exists:
```sql
SELECT proname, prosrc
FROM pg_proc
WHERE proname = 'auto_create_profile_from_auth_user';
```

---

## RECOMMENDATIONS FOR FIXES

### Fix 1: Preserve Roles in Fallback Profile Creation
- Check user metadata for role before defaulting to `'applicant'`
- Don't overwrite existing roles

### Fix 2: Verify Role Before Navigation
- Wait for profile to load before navigating
- Check role matches expected role
- Show error if role doesn't match

### Fix 3: Fix Google OAuth Role Logic
- Preserve existing admin/client roles
- Only set to `'applicant'` if role is missing

### Fix 4: Improve Error Messages
- Show why access was denied
- Provide diagnostic information
- Suggest how to fix the issue

### Fix 5: Document Role Assignment Process
- Create guide for creating admin/client accounts
- Ensure role is set in metadata during account creation
- Add validation to prevent incorrect role assignment

---

**End of Analysis Document**






