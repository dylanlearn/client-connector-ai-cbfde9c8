
import { createClient } from '@supabase/supabase-js';

// Supabase public URL and anon key (these are safe to expose in client-side code)
// For a real application, these should be environment variables
const supabaseUrl = 'https://example.supabase.co';
const supabaseAnonKey = 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// For demo purposes only - replace with your actual configuration
// Note: For production, these would be set as environment variables
export const setDemoCredentials = (url: string, key: string) => {
  if (typeof window !== 'undefined') {
    console.log('Setting demo Supabase credentials');
    (window as any).supabaseCredentials = { url, key };
  }
};

// For development/demo purposes only - initializes with demo credentials
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  setDemoCredentials(supabaseUrl, supabaseAnonKey);
}
