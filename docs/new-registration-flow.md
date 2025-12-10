# New Applicant Registration Flow

## Overview

The registration flow has been restructured to create accounts **FIRST**, then collect registration details. This ensures users can login and logout, and their progress is saved.

## Flow Structure

### 1. Account Creation (New Flow)
**Route:** `/auth/register`

**Steps:**
1. **Method Selection** (`/auth/register`)
   - Choose: Email, Phone, or Google
   
2. **Email/Phone Entry** (`/auth/register/email` or `/auth/register/phone`)
   - Enter email or phone number
   - OTP is sent (hardcoded: `123456` for now)
   
3. **OTP Verification** (`/auth/register/verify-otp`)
   - Enter 6-digit OTP
   - Hardcoded OTP: `123456`
   
4. **Password Setup** (`/auth/register/set-password`)
   - Set password and confirm password
   - Account is created with role `applicant`
   - Profile is created automatically via trigger

### 2. Registration Form (7 Steps)
**Route:** `/auth/applicant-register/step-1` through `/step-7`

**Requires:** User must be authenticated

**Steps:**
1. **Step 1:** Personal Details (Name, Email, Phone, DOB, Gender, Job Role, Communication)
2. **Step 2:** Address (State, District, City, Address Lines, Pincode, Landmark)
3. **Step 3:** Education (Multiple entries with dependent dropdowns)
4. **Step 4:** Experience (Multiple entries)
5. **Step 5:** Skills (Multiple entries)
6. **Step 6:** Documents (Resume and Profile Picture uploads)
7. **Step 7:** Review & Submit

### 3. After Submission
- Data is saved to normalized tables
- Profile is synced via trigger
- User can login anytime with email/phone + password
- Profile is visible in dashboard

## Key Features

### ✅ Account First Approach
- Account is created **before** registration form
- Users can login/logout anytime
- Progress is saved in localStorage

### ✅ Authentication Required
- All registration form steps require authentication
- Unauthenticated users are redirected to `/auth/register`

### ✅ Role Management
- Profile is created with `role = 'applicant'` during account creation
- Trigger ensures role stays `applicant` when syncing from applicants table

### ✅ OTP Verification (Temporary)
- Currently hardcoded OTP: `123456`
- Will be replaced with real OTP service later

### ✅ Google OAuth Support
- Users can sign up with Google
- New Google users are redirected to registration form
- Existing users go to their dashboard

## File Structure

### New Files Created
```
src/pages/auth/register/
├── AccountCreationMethod.tsx  # Method selection page
├── EmailSignUp.tsx            # Email signup page
├── PhoneSignUp.tsx            # Phone signup page
├── VerifyOTP.tsx              # OTP verification page
└── SetPassword.tsx             # Password setup page
```

### Updated Files
- `src/App.tsx` - Added new routes
- `src/pages/auth/applicant-register/Step1BasicInfo.tsx` - Removed OTP verification, added auth check
- `src/pages/auth/GoogleCallback.tsx` - Redirects new users to registration form
- `src/services/applicantService.ts` - Ensures role is set correctly

## User Journey

### New User Flow
1. Click "Join as Applicant" on landing page
2. Choose signup method (Email/Phone/Google)
3. Enter email/phone → Verify OTP (`123456`) → Set password
4. Account created → Redirected to registration form
5. Complete 7-step registration form
6. Submit → Profile visible in dashboard

### Returning User Flow
1. Login with email/phone + password
2. If registration incomplete → Continue from saved step
3. If registration complete → View profile in dashboard

## Security & Validation

- ✅ Password must be at least 8 characters
- ✅ Email validation
- ✅ Phone number validation (10 digits)
- ✅ OTP verification (currently hardcoded)
- ✅ All form fields validated with Zod schemas
- ✅ Protected routes require authentication

## Next Steps (Future Improvements)

1. **Real OTP Service**
   - Replace hardcoded `123456` with actual OTP service
   - Integrate SMS/Email OTP providers

2. **Progress Persistence**
   - Save form progress to database (not just localStorage)
   - Allow users to resume from any step

3. **Email Verification**
   - Send verification email after account creation
   - Require email verification before form submission

4. **Phone Verification**
   - Integrate real SMS OTP service
   - Verify phone number before account creation

## Testing Checklist

- [ ] Account creation with email
- [ ] Account creation with phone
- [ ] Account creation with Google
- [ ] OTP verification (use `123456`)
- [ ] Password setup
- [ ] Registration form access (requires auth)
- [ ] Form submission
- [ ] Login with created account
- [ ] Profile visibility after registration
- [ ] Role is correctly set to `applicant`











