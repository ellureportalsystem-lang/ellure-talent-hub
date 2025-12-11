-- Complete Database Schema Query
-- Run this in Supabase SQL Editor to get ALL schema information
-- This includes: tables, columns, constraints, indexes, functions, triggers, views, sequences, types, etc.

-- ============================================================================
-- 1. TABLES AND COLUMNS
-- ============================================================================
SELECT 
  'TABLE' as object_type,
  t.table_name as object_name,
  json_agg(
    json_build_object(
      'column_name', c.column_name,
      'data_type', c.data_type,
      'character_maximum_length', c.character_maximum_length,
      'numeric_precision', c.numeric_precision,
      'numeric_scale', c.numeric_scale,
      'is_nullable', c.is_nullable,
      'column_default', c.column_default,
      'ordinal_position', c.ordinal_position
    ) ORDER BY c.ordinal_position
  ) as details
FROM information_schema.tables t
JOIN information_schema.columns c ON t.table_name = c.table_name AND t.table_schema = c.table_schema
WHERE t.table_schema = 'public' 
  AND t.table_type = 'BASE TABLE'
GROUP BY t.table_name

UNION ALL

-- ============================================================================
-- 2. PRIMARY KEYS
-- ============================================================================
SELECT 
  'PRIMARY_KEY' as object_type,
  tc.table_name as object_name,
  json_agg(
    json_build_object(
      'constraint_name', tc.constraint_name,
      'column_name', kcu.column_name,
      'ordinal_position', kcu.ordinal_position
    ) ORDER BY kcu.ordinal_position
  ) as details
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
  ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_schema = 'public'
  AND tc.constraint_type = 'PRIMARY KEY'
GROUP BY tc.table_name

UNION ALL

-- ============================================================================
-- 3. FOREIGN KEYS
-- ============================================================================
SELECT 
  'FOREIGN_KEY' as object_type,
  tc.table_name as object_name,
  json_agg(
    json_build_object(
      'constraint_name', tc.constraint_name,
      'column_name', kcu.column_name,
      'foreign_table_name', ccu.table_name,
      'foreign_column_name', ccu.column_name
    )
  ) as details
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu 
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.table_schema = 'public'
  AND tc.constraint_type = 'FOREIGN KEY'
GROUP BY tc.table_name

UNION ALL

-- ============================================================================
-- 4. UNIQUE CONSTRAINTS
-- ============================================================================
SELECT 
  'UNIQUE_CONSTRAINT' as object_type,
  tc.table_name as object_name,
  json_agg(
    json_build_object(
      'constraint_name', tc.constraint_name,
      'column_name', kcu.column_name
    )
  ) as details
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
  ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_schema = 'public'
  AND tc.constraint_type = 'UNIQUE'
GROUP BY tc.table_name

UNION ALL

-- ============================================================================
-- 5. INDEXES
-- ============================================================================
SELECT 
  'INDEX' as object_type,
  tablename as object_name,
  json_agg(
    json_build_object(
      'indexname', indexname,
      'indexdef', indexdef
    )
  ) as details
FROM pg_indexes
WHERE schemaname = 'public'
GROUP BY tablename

UNION ALL

-- ============================================================================
-- 6. FUNCTIONS
-- ============================================================================
SELECT 
  'FUNCTION' as object_type,
  routine_name as object_name,
  json_agg(
    json_build_object(
      'routine_name', routine_name,
      'routine_type', routine_type,
      'data_type', data_type,
      'routine_definition', routine_definition
    )
  ) as details
FROM information_schema.routines
WHERE routine_schema = 'public'
GROUP BY routine_name

UNION ALL

-- ============================================================================
-- 7. TRIGGERS
-- ============================================================================
SELECT 
  'TRIGGER' as object_type,
  event_object_table as object_name,
  json_agg(
    json_build_object(
      'trigger_name', trigger_name,
      'event_manipulation', event_manipulation,
      'event_object_table', event_object_table,
      'action_statement', action_statement,
      'action_timing', action_timing
    )
  ) as details
FROM information_schema.triggers
WHERE trigger_schema = 'public'
GROUP BY event_object_table

UNION ALL

-- ============================================================================
-- 8. VIEWS
-- ============================================================================
SELECT 
  'VIEW' as object_type,
  table_name as object_name,
  json_agg(
    json_build_object(
      'view_definition', view_definition
    )
  ) as details
FROM information_schema.views
WHERE table_schema = 'public'
GROUP BY table_name

UNION ALL

-- ============================================================================
-- 9. SEQUENCES
-- ============================================================================
SELECT 
  'SEQUENCE' as object_type,
  sequence_name as object_name,
  json_agg(
    json_build_object(
      'data_type', data_type,
      'start_value', start_value,
      'minimum_value', minimum_value,
      'maximum_value', maximum_value,
      'increment', increment
    )
  ) as details
FROM information_schema.sequences
WHERE sequence_schema = 'public'
GROUP BY sequence_name

UNION ALL

-- ============================================================================
-- 10. CUSTOM TYPES
-- ============================================================================
SELECT 
  'TYPE' as object_type,
  typname as object_name,
  json_agg(
    json_build_object(
      'typtype', typtype,
      'typname', typname
    )
  ) as details
FROM pg_type t
JOIN pg_namespace n ON n.oid = t.typnamespace
WHERE n.nspname = 'public'
  AND t.typtype IN ('c', 'e') -- composite or enum types
GROUP BY typname

ORDER BY object_type, object_name;















