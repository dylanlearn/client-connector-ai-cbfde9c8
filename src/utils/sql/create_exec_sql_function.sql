
-- Function to execute SQL statements safely (needs superuser privileges)
CREATE OR REPLACE FUNCTION exec_sql(sql_query TEXT)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  EXECUTE sql_query;
END;
$$;

-- Grant access to authenticated users (adjust as needed for your security model)
GRANT EXECUTE ON FUNCTION exec_sql TO service_role;
