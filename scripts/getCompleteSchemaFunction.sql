-- Create a function to get complete database schema
-- Run this in Supabase SQL Editor first, then use queryCompleteSchema.js

CREATE OR REPLACE FUNCTION get_complete_schema()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result json;
BEGIN
  SELECT json_build_object(
    'tables', (
      SELECT json_agg(
        json_build_object(
          'table_name', t.table_name,
          'columns', (
            SELECT json_agg(
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
            )
            FROM information_schema.columns c
            WHERE c.table_schema = 'public' 
              AND c.table_name = t.table_name
          )
        )
      )
      FROM information_schema.tables t
      WHERE t.table_schema = 'public' 
        AND t.table_type = 'BASE TABLE'
    ),
    'primary_keys', (
      SELECT json_agg(
        json_build_object(
          'table_name', tc.table_name,
          'constraint_name', tc.constraint_name,
          'columns', (
            SELECT json_agg(kcu.column_name ORDER BY kcu.ordinal_position)
            FROM information_schema.key_column_usage kcu
            WHERE kcu.constraint_name = tc.constraint_name
          )
        )
      )
      FROM information_schema.table_constraints tc
      WHERE tc.table_schema = 'public'
        AND tc.constraint_type = 'PRIMARY KEY'
    ),
    'foreign_keys', (
      SELECT json_agg(
        json_build_object(
          'table_name', tc.table_name,
          'constraint_name', tc.constraint_name,
          'column_name', kcu.column_name,
          'foreign_table_name', ccu.table_name,
          'foreign_column_name', ccu.column_name
        )
      )
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu 
        ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.constraint_column_usage ccu 
        ON ccu.constraint_name = tc.constraint_name
      WHERE tc.table_schema = 'public'
        AND tc.constraint_type = 'FOREIGN KEY'
    ),
    'unique_constraints', (
      SELECT json_agg(
        json_build_object(
          'table_name', tc.table_name,
          'constraint_name', tc.constraint_name,
          'columns', (
            SELECT json_agg(kcu.column_name)
            FROM information_schema.key_column_usage kcu
            WHERE kcu.constraint_name = tc.constraint_name
          )
        )
      )
      FROM information_schema.table_constraints tc
      WHERE tc.table_schema = 'public'
        AND tc.constraint_type = 'UNIQUE'
    ),
    'indexes', (
      SELECT json_agg(
        json_build_object(
          'table_name', tablename,
          'index_name', indexname,
          'index_definition', indexdef
        )
      )
      FROM pg_indexes
      WHERE schemaname = 'public'
    ),
    'functions', (
      SELECT json_agg(
        json_build_object(
          'function_name', routine_name,
          'routine_type', routine_type,
          'data_type', data_type,
          'routine_definition', routine_definition
        )
      )
      FROM information_schema.routines
      WHERE routine_schema = 'public'
    ),
    'triggers', (
      SELECT json_agg(
        json_build_object(
          'trigger_name', trigger_name,
          'event_object_table', event_object_table,
          'event_manipulation', event_manipulation,
          'action_timing', action_timing,
          'action_statement', action_statement
        )
      )
      FROM information_schema.triggers
      WHERE trigger_schema = 'public'
    ),
    'views', (
      SELECT json_agg(
        json_build_object(
          'view_name', table_name,
          'view_definition', view_definition
        )
      )
      FROM information_schema.views
      WHERE table_schema = 'public'
    ),
    'sequences', (
      SELECT json_agg(
        json_build_object(
          'sequence_name', sequence_name,
          'data_type', data_type,
          'start_value', start_value,
          'minimum_value', minimum_value,
          'maximum_value', maximum_value,
          'increment', increment
        )
      )
      FROM information_schema.sequences
      WHERE sequence_schema = 'public'
    ),
    'types', (
      SELECT json_agg(
        json_build_object(
          'type_name', typname,
          'type_type', typtype
        )
      )
      FROM pg_type t
      JOIN pg_namespace n ON n.oid = t.typnamespace
      WHERE n.nspname = 'public'
        AND t.typtype IN ('c', 'e')
    )
  ) INTO result;
  
  RETURN result;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_complete_schema() TO anon, authenticated;













