
CREATE OR REPLACE FUNCTION public.check_table_rls(table_name text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  row_security_enabled boolean;
BEGIN
  SELECT INTO row_security_enabled
    relrowsecurity
  FROM pg_catalog.pg_class
  JOIN pg_catalog.pg_namespace ON pg_class.relnamespace = pg_namespace.oid
  WHERE pg_namespace.nspname = 'public' 
    AND pg_class.relname = table_name;
  
  RETURN COALESCE(row_security_enabled, false);
END;
$$;
