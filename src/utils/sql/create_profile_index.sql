
-- Add index to profiles table to improve query performance
CREATE INDEX IF NOT EXISTS idx_profiles_id ON public.profiles (id);

-- Add index for role lookups which are frequently used for admin checks
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles (role);

-- This index helps with both role and subscription status checks which happen together
CREATE INDEX IF NOT EXISTS idx_profiles_role_subscription ON public.profiles (role, subscription_status);

-- Analyze the table to update statistics for the query planner
ANALYZE public.profiles;
