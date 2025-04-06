
-- Create an enum for permissions
CREATE TYPE auth_permission AS ENUM (
    'VIEW_DASHBOARD',
    'MANAGE_PROJECTS',
    'EDIT_PROFILE',
    'VIEW_ANALYTICS',
    'MANAGE_USERS',
    'VIEW_ADMIN_PANEL',
    'ACCESS_PREMIUM_FEATURES'
);

-- Create a table to store all permissions
CREATE TABLE IF NOT EXISTS permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name auth_permission NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create a table to store role-permission mappings
CREATE TABLE IF NOT EXISTS role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role user_role NOT NULL,
    permission auth_permission NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(role, permission)
);

-- Insert default permissions
INSERT INTO permissions (name, description)
VALUES
    ('VIEW_DASHBOARD', 'Access to view the main dashboard'),
    ('MANAGE_PROJECTS', 'Ability to create and manage projects'),
    ('EDIT_PROFILE', 'Edit own user profile information'),
    ('VIEW_ANALYTICS', 'View analytics data'),
    ('MANAGE_USERS', 'Manage user accounts'),
    ('VIEW_ADMIN_PANEL', 'Access the admin panel'),
    ('ACCESS_PREMIUM_FEATURES', 'Access premium features')
ON CONFLICT (name) DO NOTHING;

-- Set up default role permissions
-- Admin role
INSERT INTO role_permissions (role, permission)
VALUES
    ('admin', 'VIEW_DASHBOARD'),
    ('admin', 'MANAGE_PROJECTS'),
    ('admin', 'EDIT_PROFILE'),
    ('admin', 'VIEW_ANALYTICS'),
    ('admin', 'MANAGE_USERS'),
    ('admin', 'VIEW_ADMIN_PANEL'),
    ('admin', 'ACCESS_PREMIUM_FEATURES')
ON CONFLICT (role, permission) DO NOTHING;

-- Sync-Pro role
INSERT INTO role_permissions (role, permission)
VALUES
    ('sync-pro', 'VIEW_DASHBOARD'),
    ('sync-pro', 'MANAGE_PROJECTS'),
    ('sync-pro', 'EDIT_PROFILE'),
    ('sync-pro', 'VIEW_ANALYTICS'),
    ('sync-pro', 'ACCESS_PREMIUM_FEATURES')
ON CONFLICT (role, permission) DO NOTHING;

-- Sync role
INSERT INTO role_permissions (role, permission)
VALUES
    ('sync', 'VIEW_DASHBOARD'),
    ('sync', 'MANAGE_PROJECTS'),
    ('sync', 'EDIT_PROFILE'),
    ('sync', 'VIEW_ANALYTICS')
ON CONFLICT (role, permission) DO NOTHING;

-- Trial role
INSERT INTO role_permissions (role, permission)
VALUES
    ('trial', 'VIEW_DASHBOARD'),
    ('trial', 'MANAGE_PROJECTS'),
    ('trial', 'EDIT_PROFILE')
ON CONFLICT (role, permission) DO NOTHING;

-- Free role
INSERT INTO role_permissions (role, permission)
VALUES
    ('free', 'VIEW_DASHBOARD'),
    ('free', 'EDIT_PROFILE')
ON CONFLICT (role, permission) DO NOTHING;

-- Create a function to check if a user has a specific permission
CREATE OR REPLACE FUNCTION user_has_permission(p_user_id UUID, p_permission auth_permission)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_role user_role;
BEGIN
    -- Get the user's role
    SELECT role INTO v_role FROM profiles WHERE id = p_user_id;
    
    -- Check if the role has the permission
    RETURN EXISTS (
        SELECT 1 FROM role_permissions
        WHERE role = v_role AND permission = p_permission
    );
END;
$$;

-- Create a function to get all permissions for a user
CREATE OR REPLACE FUNCTION get_user_permissions(p_user_id UUID)
RETURNS SETOF auth_permission
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_role user_role;
BEGIN
    -- Get the user's role
    SELECT role INTO v_role FROM profiles WHERE id = p_user_id;
    
    -- Return all permissions for the role
    RETURN QUERY
    SELECT permission FROM role_permissions
    WHERE role = v_role;
END;
$$;
