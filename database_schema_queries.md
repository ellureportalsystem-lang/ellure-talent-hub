# Database Schema Extraction Queries

Run these queries in your Supabase SQL Editor and provide the output for each section. This will help me understand your complete database schema and identify the persistent problem.

---

## 1. Tables and Columns

Run this query to get all tables and their columns:

```sql
SELECT 
    t.table_schema,
    t.table_name,
    c.column_name,
    c.ordinal_position,
    c.data_type,
    c.character_maximum_length,
    c.numeric_precision,
    c.numeric_scale,
    c.is_nullable,
    c.column_default,
    c.udt_name
FROM information_schema.tables t
JOIN information_schema.columns c ON t.table_name = c.table_name AND t.table_schema = c.table_schema
WHERE t.table_schema IN ('public', 'auth')
    AND t.table_type = 'BASE TABLE'
ORDER BY t.table_schema, t.table_name, c.ordinal_position;
```

---

## 2. Primary Keys

Run this query to get all primary key constraints:

```sql
SELECT
    tc.table_schema,
    tc.table_name,
    tc.constraint_name,
    kcu.column_name,
    kcu.ordinal_position
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
WHERE tc.constraint_type = 'PRIMARY KEY'
    AND tc.table_schema IN ('public', 'auth')
ORDER BY tc.table_schema, tc.table_name, kcu.ordinal_position;
```

---

## 3. Foreign Keys

Run this query to get all foreign key relationships:

```sql
SELECT
    tc.table_schema,
    tc.table_name,
    tc.constraint_name,
    kcu.column_name,
    ccu.table_schema AS foreign_table_schema,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    rc.update_rule,
    rc.delete_rule
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage ccu 
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
JOIN information_schema.referential_constraints rc
    ON tc.constraint_name = rc.constraint_name
    AND tc.table_schema = rc.constraint_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_schema IN ('public', 'auth')
ORDER BY tc.table_schema, tc.table_name, tc.constraint_name;
```

---

## 4. Unique Constraints

Run this query to get all unique constraints:

```sql
SELECT
    tc.table_schema,
    tc.table_name,
    tc.constraint_name,
    kcu.column_name,
    kcu.ordinal_position
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
WHERE tc.constraint_type = 'UNIQUE'
    AND tc.table_schema IN ('public', 'auth')
ORDER BY tc.table_schema, tc.table_name, tc.constraint_name, kcu.ordinal_position;
```

---

## 5. Check Constraints

Run this query to get all check constraints:

```sql
SELECT
    tc.table_schema,
    tc.table_name,
    tc.constraint_name,
    cc.check_clause
FROM information_schema.table_constraints tc
JOIN information_schema.check_constraints cc
    ON tc.constraint_name = cc.constraint_name
    AND tc.table_schema = cc.constraint_schema
WHERE tc.constraint_type = 'CHECK'
    AND tc.table_schema IN ('public', 'auth')
ORDER BY tc.table_schema, tc.table_name, tc.constraint_name;
```

---

## 6. Indexes

Run this query to get all indexes:

```sql
SELECT
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname IN ('public', 'auth')
ORDER BY schemaname, tablename, indexname;
```

---

## 7. Custom Types and Enums

Run this query to get all custom types and enums:

```sql
SELECT
    t.typname AS type_name,
    t.typtype AS type_type,
    CASE 
        WHEN t.typtype = 'e' THEN (
            SELECT string_agg(e.enumlabel, ', ' ORDER BY e.enumsortorder)
            FROM pg_enum e
            WHERE e.enumtypid = t.oid
        )
        ELSE NULL
    END AS enum_values,
    pg_catalog.format_type(t.oid, NULL) AS full_type_name
FROM pg_catalog.pg_type t
LEFT JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
WHERE (t.typrelid = 0 OR (SELECT c.relkind = 'c' FROM pg_catalog.pg_class c WHERE c.oid = t.typrelid))
    AND NOT EXISTS(SELECT 1 FROM pg_catalog.pg_type el WHERE el.oid = t.typelem AND el.typarray = t.oid)
    AND n.nspname IN ('public', 'auth')
    AND (t.typtype IN ('e', 'c') OR t.typname IN ('user_role', 'application_status', 'shortlist_status'))
ORDER BY t.typname;
```

---

## 8. Functions

Run this query to get all functions:

```sql
SELECT
    n.nspname AS schema_name,
    p.proname AS function_name,
    pg_get_function_arguments(p.oid) AS arguments,
    pg_catalog.pg_get_function_result(p.oid) AS return_type,
    p.prokind AS function_kind,
    CASE 
        WHEN p.prosecdef THEN 'SECURITY DEFINER'
        ELSE 'SECURITY INVOKER'
    END AS security_type,
    pg_get_functiondef(p.oid) AS function_definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname IN ('public', 'auth')
ORDER BY n.nspname, p.proname;
```

---

## 9. Triggers

Run this query to get all triggers:

```sql
SELECT
    t.trigger_schema,
    t.trigger_name,
    t.event_manipulation,
    t.event_object_schema,
    t.event_object_table,
    t.action_statement,
    t.action_timing,
    t.action_orientation,
    t.action_condition,
    p.proname AS function_name,
    pg_get_functiondef(p.oid) AS function_definition
FROM information_schema.triggers t
LEFT JOIN pg_proc p ON t.action_statement LIKE '%' || p.proname || '%'
    AND p.pronamespace::regnamespace::text = COALESCE(t.action_statement_schema, 'public')
WHERE t.trigger_schema IN ('public', 'auth')
ORDER BY t.trigger_schema, t.event_object_table, t.trigger_name;
```

---

## 10. Row Level Security (RLS) Policies

Run this query to get all RLS policies:

```sql
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname IN ('public', 'auth')
ORDER BY schemaname, tablename, policyname;
```

---

## 11. RLS Status (Enabled/Disabled)

Run this query to check which tables have RLS enabled:

```sql
SELECT
    schemaname,
    tablename,
    rowsecurity AS rls_enabled
FROM pg_tables
WHERE schemaname IN ('public', 'auth')
ORDER BY schemaname, tablename;
```

---

## 12. Views

Run this query to get all views:

```sql
SELECT
    table_schema,
    table_name,
    view_definition
FROM information_schema.views
WHERE table_schema IN ('public', 'auth')
ORDER BY table_schema, table_name;
```

---

## 13. Sequences

Run this query to get all sequences:

```sql
SELECT
    sequence_schema,
    sequence_name,
    data_type,
    numeric_precision,
    numeric_precision_radix,
    numeric_scale,
    start_value,
    minimum_value,
    maximum_value,
    increment,
    cycle_option
FROM information_schema.sequences
WHERE sequence_schema IN ('public', 'auth')
ORDER BY sequence_schema, sequence_name;
```

---

## 14. Table Grants and Permissions

Run this query to get table permissions:

```sql
SELECT
    grantee,
    table_schema,
    table_name,
    privilege_type,
    is_grantable
FROM information_schema.table_privileges
WHERE table_schema IN ('public', 'auth')
ORDER BY table_schema, table_name, grantee, privilege_type;
```

---

## 15. Function Grants and Permissions

Run this query to get function permissions:

```sql
SELECT
    p.proname AS function_name,
    n.nspname AS schema_name,
    a.rolname AS grantee,
    pr.privilege_type,
    pr.is_grantable
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
LEFT JOIN information_schema.routine_privileges pr 
    ON pr.routine_name = p.proname 
    AND pr.routine_schema = n.nspname
LEFT JOIN pg_roles a ON a.rolname = pr.grantee
WHERE n.nspname IN ('public', 'auth')
ORDER BY n.nspname, p.proname, a.rolname;
```

---

## 16. Extensions

Run this query to get installed extensions:

```sql
SELECT
    extname AS extension_name,
    extversion AS version,
    n.nspname AS schema_name
FROM pg_extension e
JOIN pg_namespace n ON e.extnamespace = n.oid
ORDER BY extname;
```

---

## 17. Trigger Function Dependencies

Run this query to see which triggers use which functions:

```sql
SELECT
    t.tgname AS trigger_name,
    n.nspname AS schema_name,
    c.relname AS table_name,
    p.proname AS function_name,
    pg_get_triggerdef(t.oid) AS trigger_definition
FROM pg_trigger t
JOIN pg_class c ON t.tgrelid = c.oid
JOIN pg_namespace n ON c.relnamespace = n.oid
JOIN pg_proc p ON t.tgfoid = p.oid
WHERE n.nspname IN ('public', 'auth')
    AND NOT t.tgisinternal
ORDER BY n.nspname, c.relname, t.tgname;
```

---

## 18. Default Values for Columns

Run this query to get all columns with default values:

```sql
SELECT
    table_schema,
    table_name,
    column_name,
    column_default,
    data_type
FROM information_schema.columns
WHERE column_default IS NOT NULL
    AND table_schema IN ('public', 'auth')
ORDER BY table_schema, table_name, ordinal_position;
```

---

## 19. Not Null Constraints

Run this query to get all NOT NULL constraints:

```sql
SELECT
    table_schema,
    table_name,
    column_name,
    is_nullable,
    data_type
FROM information_schema.columns
WHERE is_nullable = 'NO'
    AND table_schema IN ('public', 'auth')
ORDER BY table_schema, table_name, ordinal_position;
```

---

## 20. Complete Trigger Details (Alternative Query)

Run this query for more detailed trigger information:

```sql
SELECT
    n.nspname AS schema_name,
    c.relname AS table_name,
    t.tgname AS trigger_name,
    pg_get_triggerdef(t.oid) AS trigger_definition,
    CASE t.tgtype::integer & 2
        WHEN 2 THEN 'BEFORE'
        ELSE 'AFTER'
    END AS timing,
    CASE t.tgtype::integer & 4
        WHEN 4 THEN 'INSERT'
        ELSE ''
    END ||
    CASE t.tgtype::integer & 8
        WHEN 8 THEN ' UPDATE'
        ELSE ''
    END ||
    CASE t.tgtype::integer & 16
        WHEN 16 THEN ' DELETE'
        ELSE ''
    END AS events,
    CASE t.tgtype::integer & 1
        WHEN 1 THEN 'ROW'
        ELSE 'STATEMENT'
    END AS level,
    p.proname AS function_name,
    pg_get_functiondef(p.oid) AS function_definition
FROM pg_trigger t
JOIN pg_class c ON t.tgrelid = c.oid
JOIN pg_namespace n ON c.relnamespace = n.oid
JOIN pg_proc p ON t.tgfoid = p.oid
WHERE n.nspname IN ('public', 'auth')
    AND NOT t.tgisinternal
ORDER BY n.nspname, c.relname, t.tgname;
```

---

## Instructions

1. **Run each query** in your Supabase SQL Editor
2. **Copy the complete output** for each query
3. **Paste the output** in a response, clearly labeling which query each output corresponds to
4. If any query returns an error, note it and continue with the others
5. If you know there's a specific problem area (e.g., triggers, RLS, functions), you can prioritize those queries

---

## Additional Diagnostic Queries

If you're experiencing a specific issue, also run these:

### Check for Orphaned Records

```sql
-- Check for profiles without corresponding auth.users
SELECT p.id, p.email, p.phone
FROM public.profiles p
LEFT JOIN auth.users u ON p.id = u.id
WHERE u.id IS NULL;
```

### Check for Auth Users without Profiles

```sql
-- Check for auth.users without corresponding profiles
SELECT u.id, u.email, u.phone, u.created_at
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL;
```

### Check Recent Errors in Logs

```sql
-- This might not work in Supabase SQL Editor, but try:
SELECT * FROM pg_stat_statements 
ORDER BY total_exec_time DESC 
LIMIT 20;
```

---

**Note:** Some queries might return large results. If a query times out or returns too much data, let me know and I can provide more targeted queries.









