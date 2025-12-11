# Complete Database Schema Documentation

**Project:** Ellure Talent Hub  
**Database:** Supabase PostgreSQL  
**Last Updated:** January 2025  
**Schema Version:** 1.0

---

## Table of Contents

1. [Overview](#overview)
2. [Tables](#tables)
   - [applicants](#applicants-table)
   - [profiles](#profiles-table)
   - [clients](#clients-table)
   - [shortlists](#shortlists-table)
   - [shortlist_items](#shortlist_items-table)
3. [Primary Keys](#primary-keys)
4. [Foreign Keys](#foreign-keys)
5. [Unique Constraints](#unique-constraints)
6. [Indexes](#indexes)
7. [Database Functions](#database-functions)
8. [Triggers](#triggers)
9. [Custom Types](#custom-types)
10. [Storage Buckets](#storage-buckets)
11. [Row Level Security (RLS)](#row-level-security-rls)
12. [Relationships Diagram](#relationships-diagram)

---

## Overview

The Ellure Talent Hub database is designed to manage a comprehensive talent recruitment platform with three main user roles:
- **Admin**: Platform administrators
- **Client**: Companies/organizations hiring talent
- **Applicant**: Job seekers

The database consists of **5 main tables** with **12 database functions** and **8 triggers** that automate profile creation, data synchronization, and timestamp updates.

---

## Tables

### applicants Table

**Purpose:** Stores comprehensive applicant/job seeker information including personal details, education, experience, and application status.

**Total Columns:** 55

| Column Name | Data Type | Nullable | Default | Description |
|------------|-----------|----------|---------|-------------|
| `id` | uuid | NO | `gen_random_uuid()` | Primary key, unique identifier |
| `user_id` | uuid | YES | NULL | Foreign key to `profiles.id` |
| `client_id` | uuid | YES | NULL | Foreign key to `clients.id` (if client-specific) |
| `name` | text | NO | NULL | Full name (required) |
| `phone` | text | NO | NULL | Mobile number (required) |
| `email` | text | NO | NULL | Email address (required) |
| `city` | text | NO | NULL | Current city/location (required) |
| `skill` | text | YES | NULL | Skill/job role |
| `communication` | text | YES | NULL | Communication skill rating |
| `job_role` | text | YES | NULL | Job role applying for |
| `education_level` | text | YES | NULL | Highest qualification (10th, 12th, Graduation, etc.) |
| `education_board` | text | YES | NULL | Education board (CBSE, ICSE, etc.) |
| `medium` | text | YES | NULL | Medium of study (English, Hindi, etc.) |
| `course_degree` | text | YES | NULL | Course/degree name |
| `university` | text | YES | NULL | University/institute name |
| `percentage` | text | YES | NULL | Percentage/grade |
| `passing_year` | integer | YES | NULL | Year of passing |
| `experience_type` | text | YES | NULL | Fresher or Experienced |
| `total_experience` | text | YES | NULL | Total years of experience |
| `current_company` | text | YES | NULL | Current company name |
| `current_designation` | text | YES | NULL | Current job title |
| `current_ctc` | text | YES | NULL | Current salary/CTC |
| `expected_ctc` | text | YES | NULL | Expected salary/CTC |
| `key_skills` | text | YES | NULL | Comma-separated skills |
| `notice_period` | text | YES | NULL | Notice period duration |
| `availability` | text | YES | NULL | Availability status |
| `resume_file` | text | YES | NULL | Resume file path/URL |
| `profile_image` | text | YES | NULL | Profile picture path/URL |
| `status` | text | YES | `'submitted'` | Application status |
| `verified` | boolean | YES | `false` | Verification status |
| `otp_verified` | boolean | YES | `false` | OTP verification status |
| `remarks` | text | YES | NULL | Admin remarks |
| `registration_date` | timestamptz | YES | `now()` | Registration timestamp |
| `profile_complete_percent` | integer | YES | `0` | Profile completion percentage (0-100) |
| `is_deleted` | boolean | YES | `false` | Soft delete flag |
| `deleted_at` | timestamptz | YES | NULL | Deletion timestamp |
| `created_at` | timestamptz | NO | `now()` | Creation timestamp |
| `updated_at` | timestamptz | NO | `now()` | Last update timestamp (auto-updated) |
| `date` | text | YES | NULL | Legacy date field |
| `full_name` | text | YES | NULL | Duplicate of `name` (legacy) |
| `mobile_number` | text | YES | NULL | Duplicate of `phone` (legacy) |
| `email_address` | text | YES | NULL | Duplicate of `email` (legacy) |
| `city_current_location` | text | YES | NULL | Duplicate of `city` (legacy) |
| `skill_job_role_applying_for` | text | YES | NULL | Duplicate of `job_role` (legacy) |
| `highest_qualification` | text | YES | NULL | Duplicate of `education_level` (legacy) |
| `medium_of_study` | text | YES | NULL | Duplicate of `medium` (legacy) |
| `course_degree_name` | text | YES | NULL | Duplicate of `course_degree` (legacy) |
| `university_institute_name` | text | YES | NULL | Duplicate of `university` (legacy) |
| `year_of_passing` | text | YES | NULL | Duplicate of `passing_year` (legacy) |
| `work_experience` | text | YES | NULL | Duplicate of `experience_type` (legacy) |
| `total_experience_numbers` | text | YES | NULL | Duplicate of `total_experience` (legacy) |
| `exp_ctc` | text | YES | NULL | Duplicate of `expected_ctc` (legacy) |
| `key_skill` | text | YES | NULL | Duplicate of `key_skills` (legacy) |
| `upload_cv_any_format` | text | YES | NULL | Duplicate of `resume_file` (legacy) |
| `education` | text | YES | NULL | General education field (legacy) |

**Indexes:**
- Primary key: `applicants_pkey` on `id`
- Unique: `applicants_user_id_key` on `user_id`
- Indexes: `user_id`, `client_id`, `email`, `phone`, `status`, `is_deleted`, `created_at`
- Composite: `client_id + status` (where `is_deleted = false`), `user_id + status` (where `is_deleted = false`)

**Triggers:**
- `trg_auto_create_profile_from_applicant` (AFTER INSERT/UPDATE)
- `trg_auto_update_profile_on_applicant_insert` (AFTER INSERT)
- `trg_auto_update_profile_on_applicant_update` (AFTER UPDATE)
- `update_applicants_updated_at` (BEFORE UPDATE)

---

### profiles Table

**Purpose:** Central user profile table linked to Supabase Auth. Stores user authentication and role information.

**Total Columns:** 44

| Column Name | Data Type | Nullable | Default | Description |
|------------|-----------|----------|---------|-------------|
| `id` | uuid | NO | NULL | Primary key, matches `auth.users.id` |
| `email` | text | NO | NULL | Email address (unique) |
| `phone` | text | YES | NULL | Phone number |
| `full_name` | text | YES | NULL | Full name |
| `role` | user_role | NO | `'applicant'` | User role enum: `admin`, `client`, `applicant` |
| `client_id` | uuid | YES | NULL | Foreign key to `clients.id` (if role = 'client') |
| `applicant_id` | uuid | YES | NULL | Foreign key to `applicants.id` (if role = 'applicant') |
| `password_changed` | boolean | YES | `false` | Password change flag |
| `must_change_password` | boolean | YES | `false` | Force password change flag |
| `is_old_applicant` | boolean | YES | `false` | Legacy applicant flag |
| `display_name` | text | YES | NULL | Display name |
| `headline` | text | YES | NULL | Profile headline |
| `summary` | text | YES | NULL | Profile summary |
| `location` | text | YES | NULL | Location |
| `key_skills` | text | YES | NULL | Key skills |
| `resume_file` | text | YES | NULL | Resume file path |
| `profile_image` | text | YES | NULL | Profile image path |
| `profile_complete_percent` | integer | YES | `0` | Profile completion (0-100) |
| `created_at` | timestamptz | NO | `now()` | Creation timestamp |
| `updated_at` | timestamptz | NO | `now()` | Last update timestamp (auto-updated) |
| `date` | text | YES | NULL | Legacy date field |
| `mobile_number` | text | YES | NULL | Duplicate of `phone` (legacy) |
| `email_address` | text | YES | NULL | Duplicate of `email` (legacy) |
| `city_current_location` | text | YES | NULL | Duplicate of `location` (legacy) |
| `skill` | text | YES | NULL | Skill field |
| `skill_job_role_applying_for` | text | YES | NULL | Job role field |
| `communication` | text | YES | NULL | Communication rating |
| `highest_qualification` | text | YES | NULL | Education level |
| `education_board` | text | YES | NULL | Education board |
| `medium_of_study` | text | YES | NULL | Medium of study |
| `course_degree_name` | text | YES | NULL | Course/degree |
| `university_institute_name` | text | YES | NULL | University/institute |
| `year_of_passing` | text | YES | NULL | Year of passing |
| `work_experience` | text | YES | NULL | Work experience type |
| `total_experience_numbers` | text | YES | NULL | Total experience |
| `current_company` | text | YES | NULL | Current company |
| `current_designation` | text | YES | NULL | Current designation |
| `current_ctc` | text | YES | NULL | Current CTC |
| `exp_ctc` | text | YES | NULL | Expected CTC |
| `notice_period` | text | YES | NULL | Notice period |
| `key_skill` | text | YES | NULL | Key skill |
| `upload_cv_any_format` | text | YES | NULL | Resume file (legacy) |
| `education` | text | YES | NULL | Education field |
| `contact` | text | YES | NULL | Contact information |

**Indexes:**
- Primary key: `profiles_pkey` on `id`
- Unique: `profiles_email_key` on `email`, `profiles_applicant_id_key` on `applicant_id`
- Indexes: `email`, `role`, `client_id`, `applicant_id`
- Unique partial: `applicant_id` (where `applicant_id IS NOT NULL`)
- Composite: `role + client_id` (where `client_id IS NOT NULL`)

**Triggers:**
- `update_profiles_updated_at` (BEFORE UPDATE)

**Check Constraints:**
- `profiles_role_client_check`: If `role = 'client'`, then `client_id` must be set

---

### clients Table

**Purpose:** Stores client company information, subscription details, and usage tracking.

**Total Columns:** 18

| Column Name | Data Type | Nullable | Default | Description |
|------------|-----------|----------|---------|-------------|
| `id` | uuid | NO | `gen_random_uuid()` | Primary key |
| `user_id` | uuid | YES | NULL | Foreign key to `profiles.id` (unique) |
| `company_name` | text | NO | NULL | Company name (required) |
| `contact_person` | text | YES | NULL | Contact person name |
| `email` | text | NO | NULL | Company email (unique, required) |
| `phone` | text | YES | NULL | Company phone |
| `slug` | text | YES | NULL | URL-friendly slug (unique) |
| `subscription_plan` | text | NO | NULL | Subscription plan name (required) |
| `subscription_status` | text | YES | `'active'` | Subscription status |
| `payment_id` | text | YES | NULL | Payment transaction ID (unique) |
| `payment_date` | timestamptz | YES | NULL | Payment date |
| `subscription_start_date` | timestamptz | NO | `now()` | Subscription start date |
| `subscription_end_date` | timestamptz | YES | NULL | Subscription end date |
| `max_applicants` | integer | YES | `1000` | Maximum applicants allowed |
| `used_applicants` | integer | YES | `0` | Number of applicants used |
| `is_active` | boolean | YES | `true` | Active status |
| `created_at` | timestamptz | NO | `now()` | Creation timestamp |
| `updated_at` | timestamptz | NO | `now()` | Last update timestamp (auto-updated) |

**Indexes:**
- Primary key: `clients_pkey` on `id`
- Unique: `user_id`, `email`, `slug`, `payment_id`
- Indexes: `user_id`, `slug`, `subscription_status`, `email`

**Triggers:**
- `update_clients_updated_at` (BEFORE UPDATE)

---

### shortlists Table

**Purpose:** Stores shortlist folders created by admins or clients to organize candidates.

**Total Columns:** 9

| Column Name | Data Type | Nullable | Default | Description |
|------------|-----------|----------|---------|-------------|
| `id` | uuid | NO | `gen_random_uuid()` | Primary key |
| `owner_id` | uuid | NO | NULL | Foreign key to `profiles.id` |
| `owner_type` | owner_type | NO | NULL | Owner type enum (admin/client) |
| `name` | text | NO | NULL | Shortlist name (required) |
| `description` | text | YES | NULL | Shortlist description |
| `is_shared` | boolean | YES | `false` | Sharing status |
| `shared_token` | text | YES | NULL | Share token (unique) |
| `created_at` | timestamptz | NO | `now()` | Creation timestamp |
| `updated_at` | timestamptz | NO | `now()` | Last update timestamp (auto-updated) |

**Indexes:**
- Primary key: `shortlists_pkey` on `id`
- Unique: `shared_token`
- Indexes: `owner_id`, `owner_type`
- Partial: `shared_token` (where `shared_token IS NOT NULL`)

**Triggers:**
- `update_shortlists_updated_at` (BEFORE UPDATE)

---

### shortlist_items Table

**Purpose:** Stores individual applicants added to shortlists (many-to-many relationship).

**Total Columns:** 5

| Column Name | Data Type | Nullable | Default | Description |
|------------|-----------|----------|---------|-------------|
| `id` | uuid | NO | `gen_random_uuid()` | Primary key |
| `shortlist_id` | uuid | NO | NULL | Foreign key to `shortlists.id` |
| `applicant_id` | uuid | NO | NULL | Foreign key to `applicants.id` |
| `notes` | text | YES | NULL | Notes about applicant in this shortlist |
| `added_at` | timestamptz | NO | `now()` | When added to shortlist |

**Indexes:**
- Primary key: `shortlist_items_pkey` on `id`
- Unique composite: `shortlist_id + applicant_id` (prevents duplicates)
- Indexes: `shortlist_id`, `applicant_id`

---

## Primary Keys

| Table | Constraint Name | Column(s) |
|-------|----------------|-----------|
| `applicants` | `applicants_pkey` | `id` |
| `profiles` | `profiles_pkey` | `id` |
| `clients` | `clients_pkey` | `id` |
| `shortlists` | `shortlists_pkey` | `id` |
| `shortlist_items` | `shortlist_items_pkey` | `id` |

---

## Foreign Keys

| Table | Column | References | Constraint Name | On Delete | On Update |
|-------|--------|------------|-----------------|-----------|-----------|
| `profiles` | `client_id` | `clients.id` | `profiles_client_id_fkey` | - | - |
| `applicants` | `user_id` | `profiles.id` | `applicants_user_id_fkey` | - | - |
| `applicants` | `client_id` | `clients.id` | `applicants_client_id_fkey` | - | - |
| `shortlists` | `owner_id` | `profiles.id` | `shortlists_owner_id_fkey` | - | - |
| `shortlist_items` | `shortlist_id` | `shortlists.id` | `shortlist_items_shortlist_id_fkey` | - | - |
| `shortlist_items` | `applicant_id` | `applicants.id` | `shortlist_items_applicant_id_fkey` | - | - |

---

## Unique Constraints

| Table | Constraint Name | Column(s) | Purpose |
|-------|----------------|-----------|---------|
| `clients` | `clients_user_id_key` | `user_id` | One client per user |
| `clients` | `clients_email_key` | `email` | Unique email |
| `clients` | `clients_slug_key` | `slug` | Unique URL slug |
| `clients` | `clients_payment_id_key` | `payment_id` | Unique payment ID |
| `profiles` | `profiles_email_key` | `email` | Unique email |
| `profiles` | `profiles_applicant_id_key` | `applicant_id` | One profile per applicant |
| `applicants` | `applicants_user_id_key` | `user_id` | One applicant per user |
| `shortlists` | `shortlists_shared_token_key` | `shared_token` | Unique share token |
| `shortlist_items` | `shortlist_items_shortlist_id_applicant_id_key` | `shortlist_id`, `applicant_id` | Prevent duplicate entries |

---

## Indexes

### applicants Table
- `applicants_pkey` (PRIMARY KEY) on `id`
- `applicants_user_id_key` (UNIQUE) on `user_id`
- `idx_applicants_user_id` on `user_id`
- `idx_applicants_client_id` on `client_id`
- `idx_applicants_email` on `email`
- `idx_applicants_phone` on `phone`
- `idx_applicants_status` on `status`
- `idx_applicants_is_deleted` on `is_deleted`
- `idx_applicants_created_at` on `created_at`
- `idx_applicants_client_status` on `client_id, status` (WHERE `is_deleted = false`)
- `idx_applicants_user_status` on `user_id, status` (WHERE `is_deleted = false`)

### profiles Table
- `profiles_pkey` (PRIMARY KEY) on `id`
- `profiles_email_key` (UNIQUE) on `email`
- `profiles_applicant_id_key` (UNIQUE) on `applicant_id`
- `idx_profiles_email` on `email`
- `idx_profiles_role` on `role`
- `idx_profiles_client_id` on `client_id`
- `idx_profiles_applicant_id` on `applicant_id`
- `idx_profiles_applicant_id_unique` (UNIQUE) on `applicant_id` (WHERE `applicant_id IS NOT NULL`)
- `idx_profiles_role_client` on `role, client_id` (WHERE `client_id IS NOT NULL`)

### clients Table
- `clients_pkey` (PRIMARY KEY) on `id`
- `clients_user_id_key` (UNIQUE) on `user_id`
- `clients_email_key` (UNIQUE) on `email`
- `clients_slug_key` (UNIQUE) on `slug`
- `clients_payment_id_key` (UNIQUE) on `payment_id`
- `idx_clients_user_id` on `user_id`
- `idx_clients_slug` on `slug`
- `idx_clients_subscription_status` on `subscription_status`
- `idx_clients_email` on `email`

### shortlists Table
- `shortlists_pkey` (PRIMARY KEY) on `id`
- `shortlists_shared_token_key` (UNIQUE) on `shared_token`
- `idx_shortlists_owner_id` on `owner_id`
- `idx_shortlists_owner_type` on `owner_type`
- `idx_shortlists_shared_token` on `shared_token` (WHERE `shared_token IS NOT NULL`)

### shortlist_items Table
- `shortlist_items_pkey` (PRIMARY KEY) on `id`
- `shortlist_items_shortlist_id_applicant_id_key` (UNIQUE) on `shortlist_id, applicant_id`
- `idx_shortlist_items_shortlist_id` on `shortlist_id`
- `idx_shortlist_items_applicant_id` on `applicant_id`

---

## Database Functions

### 1. `get_complete_schema()`
**Type:** FUNCTION  
**Returns:** JSON  
**Purpose:** Retrieves complete database schema including tables, columns, constraints, indexes, functions, triggers, views, sequences, and custom types. Used for schema introspection.

**Security:** `SECURITY DEFINER`  
**Grants:** `anon`, `authenticated`

---

### 2. `auto_update_profile_from_applicant()`
**Type:** TRIGGER FUNCTION  
**Returns:** TRIGGER  
**Purpose:** Automatically updates profile when applicant data is inserted or updated. Syncs email and full_name from applicant to profile.

**Used By Triggers:**
- `trg_auto_update_profile_on_applicant_insert` (AFTER INSERT)
- `trg_auto_update_profile_on_applicant_update` (AFTER UPDATE)

---

### 3. `get_user_role()`
**Type:** FUNCTION  
**Returns:** `user_role` enum  
**Purpose:** Returns the role of the currently authenticated user.

**Usage:** `SELECT get_user_role();`

---

### 4. `auto_create_profile_from_auth_user()`
**Type:** TRIGGER FUNCTION  
**Returns:** TRIGGER  
**Purpose:** Automatically creates a profile when a new auth user is created. Determines role from metadata or defaults to 'applicant'.

**Note:** This trigger should be attached to `auth.users` table (Supabase Auth).

---

### 5. `is_admin()`
**Type:** FUNCTION  
**Returns:** BOOLEAN  
**Purpose:** Checks if the currently authenticated user has admin role.

**Usage:** `SELECT is_admin();`

---

### 6. `auto_create_profile_from_applicant()`
**Type:** TRIGGER FUNCTION  
**Returns:** TRIGGER  
**Purpose:** Automatically creates or updates profile when applicant is inserted or updated. Links applicant data to user profile.

**Used By Triggers:**
- `trg_auto_create_profile_from_applicant` (AFTER INSERT)
- `trg_auto_create_profile_from_applicant` (AFTER UPDATE)

**Logic:**
- If `user_id` is provided, updates existing profile or creates new one
- Sets `applicant_id`, `display_name`, `location`, `key_skills`, `resume_file`, `profile_image`
- Marks as old applicant if needed

---

### 7. `is_client()`
**Type:** FUNCTION  
**Returns:** BOOLEAN  
**Purpose:** Checks if the currently authenticated user has client role.

**Usage:** `SELECT is_client();`

---

### 8. `is_client_of(cid uuid)`
**Type:** FUNCTION  
**Returns:** BOOLEAN  
**Parameters:** `cid` - Client ID  
**Purpose:** Checks if the currently authenticated user is a client with the specified client_id.

**Usage:** `SELECT is_client_of('client-uuid-here');`

---

### 9. `is_self(uid uuid)`
**Type:** FUNCTION  
**Returns:** BOOLEAN  
**Parameters:** `uid` - User ID  
**Purpose:** Checks if the provided user ID matches the currently authenticated user.

**Usage:** `SELECT is_self('user-uuid-here');`

---

### 10. `can_admin_access()`
**Type:** FUNCTION  
**Returns:** BOOLEAN  
**Purpose:** Wrapper function that calls `is_admin()`. Used for RLS policies.

**Usage:** `SELECT can_admin_access();`

---

### 11. `update_updated_at_column()`
**Type:** TRIGGER FUNCTION  
**Returns:** TRIGGER  
**Purpose:** Automatically updates the `updated_at` timestamp column before UPDATE operations.

**Used By Triggers:**
- `update_profiles_updated_at` (BEFORE UPDATE on `profiles`)
- `update_applicants_updated_at` (BEFORE UPDATE on `applicants`)
- `update_clients_updated_at` (BEFORE UPDATE on `clients`)
- `update_shortlists_updated_at` (BEFORE UPDATE on `shortlists`)

---

### 12. `can_client_access(cid uuid)`
**Type:** FUNCTION  
**Returns:** BOOLEAN  
**Parameters:** `cid` - Client ID  
**Purpose:** Checks if the currently authenticated user is a client and matches the specified client_id. Used for RLS policies.

**Usage:** `SELECT can_client_access('client-uuid-here');`

---

## Triggers

| Trigger Name | Table | Event | Timing | Function | Purpose |
|-------------|-------|-------|--------|----------|---------|
| `update_profiles_updated_at` | `profiles` | UPDATE | BEFORE | `update_updated_at_column()` | Auto-update `updated_at` |
| `update_applicants_updated_at` | `applicants` | UPDATE | BEFORE | `update_updated_at_column()` | Auto-update `updated_at` |
| `update_clients_updated_at` | `clients` | UPDATE | BEFORE | `update_updated_at_column()` | Auto-update `updated_at` |
| `update_shortlists_updated_at` | `shortlists` | UPDATE | BEFORE | `update_updated_at_column()` | Auto-update `updated_at` |
| `trg_auto_create_profile_from_applicant` | `applicants` | INSERT | AFTER | `auto_create_profile_from_applicant()` | Auto-create/update profile |
| `trg_auto_create_profile_from_applicant` | `applicants` | UPDATE | AFTER | `auto_create_profile_from_applicant()` | Auto-update profile |
| `trg_auto_update_profile_on_applicant_insert` | `applicants` | INSERT | AFTER | `auto_update_profile_from_applicant()` | Sync profile on insert |
| `trg_auto_update_profile_on_applicant_update` | `applicants` | UPDATE | AFTER | `auto_update_profile_from_applicant()` | Sync profile on update |

---

## Custom Types

### Enum Types

#### `user_role`
**Type:** ENUM  
**Values:**
- `admin` - Platform administrator
- `client` - Client company user
- `applicant` - Job seeker/applicant

**Used In:** `profiles.role`

---

#### `work_experience_type`
**Type:** ENUM  
**Values:** (Not fully documented in schema, likely: `fresher`, `experienced`)

**Used In:** (May be used in application logic)

---

#### `applicant_status`
**Type:** ENUM  
**Values:** (Not fully documented in schema, likely: `submitted`, `reviewed`, `shortlisted`, `rejected`, `hired`)

**Used In:** (May be used in application logic)

---

#### `communication_rating`
**Type:** ENUM  
**Values:** (Not fully documented in schema, likely: `good`, `okay`, `average`, `poor`)

**Used In:** (May be used in application logic)

---

#### `qualification_level`
**Type:** ENUM  
**Values:** (Not fully documented in schema, likely: `10th`, `12th`, `diploma`, `graduation`, `post-graduation`, etc.)

**Used In:** (May be used in application logic)

---

### Composite Types

#### `clients`
**Type:** COMPOSITE  
**Purpose:** Composite type representing client structure (likely used in functions)

---

#### `profiles`
**Type:** COMPOSITE  
**Purpose:** Composite type representing profile structure (likely used in functions)

---

#### `applicants`
**Type:** COMPOSITE  
**Purpose:** Composite type representing applicant structure (likely used in functions)

---

#### `shortlists`
**Type:** COMPOSITE  
**Purpose:** Composite type representing shortlist structure (likely used in functions)

---

#### `shortlist_items`
**Type:** COMPOSITE  
**Purpose:** Composite type representing shortlist item structure (likely used in functions)

---

## Storage Buckets

### Expected Storage Buckets

Based on the application code, the following storage buckets are expected:

#### `applicant-files`
**Purpose:** Stores applicant resumes and profile pictures  
**Structure:**
```
applicant-files/
  └── {user_id}/
      ├── resume_{timestamp}.pdf
      └── profile_{timestamp}.jpg
```

**Fallback:** If `applicant-files` bucket doesn't exist, the application falls back to `files` bucket.

**Permissions:** Should allow authenticated users to upload their own files.

---

## Row Level Security (RLS)

**Note:** RLS policies are not fully documented in the schema JSON. However, based on the security functions available, the following RLS patterns are likely implemented:

### Expected RLS Policies

#### `profiles` Table
- **Admin Access:** Admins can read/write all profiles
- **Self Access:** Users can read/update their own profile
- **Client Access:** Clients can read profiles of applicants assigned to them

#### `applicants` Table
- **Admin Access:** Admins can read/write all applicants
- **Self Access:** Applicants can read/update their own applicant record
- **Client Access:** Clients can read applicants assigned to them (via `client_id`)

#### `clients` Table
- **Admin Access:** Admins can read/write all clients
- **Self Access:** Clients can read their own client record

#### `shortlists` Table
- **Admin Access:** Admins can read/write all shortlists
- **Owner Access:** Users can read/write their own shortlists

#### `shortlist_items` Table
- **Admin Access:** Admins can read/write all shortlist items
- **Shortlist Owner Access:** Users can read/write items in their own shortlists

**Security Functions Used:**
- `is_admin()` - Check admin role
- `is_client()` - Check client role
- `is_client_of(cid)` - Check specific client
- `is_self(uid)` - Check self access
- `can_admin_access()` - Admin access check
- `can_client_access(cid)` - Client access check

---

## Relationships Diagram

```
┌─────────────────┐
│  auth.users     │ (Supabase Auth)
└────────┬────────┘
         │
         │ 1:1
         ▼
┌─────────────────┐
│    profiles     │
│  (id = auth.id) │
└─────┬───────────┘
      │
      ├─── 1:1 ────► ┌──────────┐
      │              │ clients   │
      │              └───────────┘
      │
      ├─── 1:1 ────► ┌──────────┐
      │              │applicants│
      │              └─────┬────┘
      │                    │
      │                    │ N:1
      │                    ▼
      │              ┌──────────┐
      │              │ clients  │ (client_id)
      │              └──────────┘
      │
      └─── 1:N ────► ┌──────────┐
                     │shortlists│
                     └─────┬────┘
                           │
                           │ 1:N
                           ▼
                     ┌──────────────┐
                     │shortlist_items│
                     └──────┬───────┘
                            │
                            │ N:1
                            ▼
                     ┌──────────┐
                     │applicants│
                     └──────────┘
```

---

## Data Flow

### Applicant Registration Flow

1. **User Registration** → `auth.users` created
2. **Profile Creation** → `profiles` created (via trigger `auto_create_profile_from_auth_user`)
3. **Applicant Data Entry** → `applicants` record created with `user_id`
4. **Profile Sync** → `profiles` updated automatically (via trigger `trg_auto_create_profile_from_applicant`)
5. **Profile Completion** → `profile_complete_percent` calculated and updated

### Client Creation Flow

1. **Client Registration** → `auth.users` created with role metadata
2. **Profile Creation** → `profiles` created with `role = 'client'`
3. **Client Record** → `clients` record created with `user_id` and `client_id` set in profile

---

## Notes

### Legacy Fields
Many tables contain duplicate/legacy fields (e.g., `full_name` and `name`, `mobile_number` and `phone`). These exist for backward compatibility with older data imports.

### Soft Deletes
The `applicants` table uses soft deletes via `is_deleted` flag. Queries should filter `WHERE is_deleted = false` to exclude deleted records.

### Auto-Timestamps
All tables have `created_at` and `updated_at` timestamps. `updated_at` is automatically maintained by triggers.

### Profile Completion
Profile completion percentage is calculated based on filled fields and stored in both `applicants.profile_complete_percent` and `profiles.profile_complete_percent`.

---

## Maintenance

### Regular Tasks
1. **Cleanup:** Remove soft-deleted records older than X days
2. **Index Maintenance:** Monitor index usage and optimize as needed
3. **Storage Cleanup:** Remove orphaned files from storage buckets
4. **Profile Sync:** Ensure triggers are working correctly (monitor logs)

### Backup Recommendations
- Daily backups of all tables
- Weekly backups of storage buckets
- Monthly schema snapshots

---

**Document Version:** 1.0  
**Last Updated:** January 2025  
**Maintained By:** Development Team












