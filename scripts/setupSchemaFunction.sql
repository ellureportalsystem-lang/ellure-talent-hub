-- SQL function to get database schema
-- Run this in your Supabase SQL Editor, then you can call it via RPC

CREATE OR REPLACE FUNCTION get_database_schema()
RETURNS TABLE (
  table_name text,
  column_name text,
  data_type text,
  character_max_length integer,
  numeric_precision integer,
  numeric_scale integer,
  is_nullable text,
  column_default text,
  ordinal_position integer
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.table_name::text,
    c.column_name::text,
    c.data_type::text,
    c.character_maximum_length::integer,
    c.numeric_precision::integer,
    c.numeric_scale::integer,
    c.is_nullable::text,
    c.column_default::text,
    c.ordinal_position::integer
  FROM information_schema.tables t
  JOIN information_schema.columns c ON t.table_name = c.table_name
  WHERE t.table_schema = 'public' 
    AND t.table_type = 'BASE TABLE'
  ORDER BY t.table_name, c.ordinal_position;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_database_schema() TO anon, authenticated;














