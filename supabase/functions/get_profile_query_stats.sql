
-- The base function is now defined in _shared/create-rpc-functions.sql
-- This file is kept for backward compatibility but now uses the base function

CREATE OR REPLACE FUNCTION public.get_profile_query_stats()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Simply call the base function with default parameters
  RETURN public.analyze_profile_queries();
END;
$$;
