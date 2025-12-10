# Complete Database Schema Reference

**Date:** January 2025  
**Source:** `schema.json` (complete database schema export)  
**Status:** Complete Analysis with Fixes Applied

---

## Overview

This document provides a complete reference to the database schema extracted from your Supabase database. The raw schema data is stored in `schema.json` at the project root.

---

## Quick Links

- **Raw Schema Data:** `schema.json`
- **Analysis & Issues:** `docs/database-schema-analysis-and-fixes.md`
- **Fix Script:** `scripts/comprehensive-database-fix.sql`
- **Existing Documentation:** `docs/database-schema-complete.md`

---

## Schema Summary

### Tables (5 total)

1. **applicants** - 55 columns
   - Primary Key: `id` (uuid)
   - Foreign Keys: `user_id` → `profiles.id`, `client_id` → `clients.id`
   - Unique: `user_id`
   - Indexes: 10 indexes including composite indexes

2. **profiles** - 44 columns
   - Primary Key: `id` (uuid, matches `auth.users.id`)
   - Foreign Keys: `client_id` → `clients.id`
   - Unique: `email`, `applicant_id`
   - Indexes: 8 indexes

3. **clients** - 18 columns
   - Primary Key: `id` (uuid)
   - Foreign Keys: `user_id` → `profiles.id`
   - Unique: `user_id`, `email`, `slug`, `payment_id`
   - Indexes: 9 indexes

4. **shortlists** - 9 columns
   - Primary Key: `id` (uuid)
   - Foreign Keys: `owner_id` → `profiles.id`
   - Unique: `shared_token`
   - Indexes: 5 indexes

5. **shortlist_items** - 5 columns
   - Primary Key: `id` (uuid)
   - Foreign Keys: `shortlist_id` → `shortlists.id`, `applicant_id` → `applicants.id`
   - Unique: `shortlist_id + applicant_id` (composite)
   - Indexes: 3 indexes

---

## Functions (12 total)

### Trigger Functions (3)
1. `auto_create_profile_from_auth_user()` - Creates profile when auth user is created
2. `auto_create_profile_from_applicant()` - Creates/updates profile when applicant is created/updated
3. `auto_update_profile_from_applicant()` - Updates profile from applicant data
4. `update_updated_at_column()` - Auto-updates `updated_at` timestamp

### Security Functions (5)
1. `is_admin()` - Check if current user is admin
2. `is_client()` - Check if current user is client
3. `is_client_of(cid uuid)` - Check if current user is specific client
4. `is_self(uid uuid)` - Check if current user matches provided ID
5. `can_admin_access()` - Wrapper for admin check
6. `can_client_access(cid uuid)` - Wrapper for client access check

### Utility Functions (3)
1. `get_user_role()` - Get current user's role
2. `get_complete_schema()` - Returns complete schema as JSON

---

## Triggers (8 total)

### Profile Synchronization (4)
- `trg_auto_create_profile_from_auth` - On `auth.users` INSERT
- `trg_auto_create_profile_from_applicant` - On `applicants` INSERT/UPDATE
- `trg_auto_update_profile_on_applicant_insert` - On `applicants` INSERT
- `trg_auto_update_profile_on_applicant_update` - On `applicants` UPDATE

### Timestamp Maintenance (4)
- `update_profiles_updated_at` - On `profiles` UPDATE
- `update_applicants_updated_at` - On `applicants` UPDATE
- `update_clients_updated_at` - On `clients` UPDATE
- `update_shortlists_updated_at` - On `shortlists` UPDATE

---

## Constraints

### Primary Keys (5)
- All tables have single-column UUID primary keys

### Foreign Keys (6)
- `profiles.client_id` → `clients.id`
- `applicants.user_id` → `profiles.id`
- `applicants.client_id` → `clients.id`
- `shortlists.owner_id` → `profiles.id`
- `shortlist_items.shortlist_id` → `shortlists.id`
- `shortlist_items.applicant_id` → `applicants.id`

### Unique Constraints (8)
- `clients.user_id` - One client per user
- `clients.email` - Unique email
- `clients.slug` - Unique URL slug
- `clients.payment_id` - Unique payment ID
- `profiles.email` - Unique email
- `profiles.applicant_id` - One profile per applicant
- `applicants.user_id` - One applicant per user
- `shortlists.shared_token` - Unique share token
- `shortlist_items(shortlist_id, applicant_id)` - No duplicate entries

---

## Custom Types (Enums)

1. **user_role** - `admin`, `client`, `applicant`
2. **work_experience_type** - (values not fully documented)
3. **applicant_status** - (values not fully documented)
4. **communication_rating** - (values not fully documented)
5. **qualification_level** - (values not fully documented)
6. **owner_type** - Used in `shortlists.owner_type`

### Composite Types
- `clients`, `profiles`, `applicants`, `shortlists`, `shortlist_items`

---

## Critical Issues Identified

See `docs/database-schema-analysis-and-fixes.md` for complete details.

### 🔴 Critical Issues (5)
1. Empty email violation in `auto_create_profile_from_auth_user()`
2. Missing `created_at` and `updated_at` in `auto_create_profile_from_auth_user()`
3. Empty email in `auto_create_profile_from_applicant()`
4. Conflicting triggers on `applicants` table
5. Missing trigger verification on `auth.users`

---

## Fixes Applied

All fixes are in `scripts/comprehensive-database-fix.sql`:

1. ✅ Safe email generation for phone-only signups
2. ✅ Explicit `created_at` and `updated_at` in all profile creation functions
3. ✅ Error handling added to prevent cascade failures
4. ✅ Trigger verification and creation

---

## Data Relationships

```
auth.users (Supabase Auth)
    ↓ 1:1
profiles
    ├── 1:1 → clients (if role = 'client')
    ├── 1:1 → applicants (if role = 'applicant')
    └── 1:N → shortlists
                └── 1:N → shortlist_items
                            └── N:1 → applicants
```

---

## Indexes Summary

### applicants (10 indexes)
- Primary key, unique `user_id`
- Indexes on: `user_id`, `client_id`, `email`, `phone`, `status`, `is_deleted`, `created_at`
- Composite: `(client_id, status)` and `(user_id, status)` with WHERE clauses

### profiles (8 indexes)
- Primary key, unique `email`, unique `applicant_id`
- Indexes on: `email`, `role`, `client_id`, `applicant_id`
- Composite: `(role, client_id)` with WHERE clause

### clients (9 indexes)
- Primary key, unique `user_id`, `email`, `slug`, `payment_id`
- Indexes on: `user_id`, `slug`, `subscription_status`, `email`

### shortlists (5 indexes)
- Primary key, unique `shared_token`
- Indexes on: `owner_id`, `owner_type`, `shared_token` (partial)

### shortlist_items (3 indexes)
- Primary key, unique composite `(shortlist_id, applicant_id)`
- Indexes on: `shortlist_id`, `applicant_id`

---

## Notes

1. **Legacy Fields**: Many tables contain duplicate/legacy fields for backward compatibility
2. **Soft Deletes**: `applicants` table uses `is_deleted` flag
3. **Auto-Timestamps**: All tables have `created_at` and `updated_at` maintained by triggers
4. **Profile Completion**: Stored in both `applicants` and `profiles` tables

---

## Verification Queries

Run these after applying fixes:

```sql
-- Check for empty emails
SELECT id, email FROM profiles WHERE email = '' OR email IS NULL;

-- Check for orphaned records
SELECT COUNT(*) FROM auth.users u LEFT JOIN profiles p ON u.id = p.id WHERE p.id IS NULL;

-- Verify triggers exist
SELECT trigger_name FROM information_schema.triggers 
WHERE event_object_table = 'users' AND trigger_schema = 'auth';
```

---

## Next Steps

1. ✅ Review `docs/database-schema-analysis-and-fixes.md`
2. ✅ Run `scripts/comprehensive-database-fix.sql`
3. ✅ Verify fixes with verification queries
4. ✅ Test system with various scenarios
5. ⚠️ Monitor Supabase logs for warnings

---

**Document Version:** 1.0  
**Last Updated:** January 2025  
**Maintained By:** Development Team









