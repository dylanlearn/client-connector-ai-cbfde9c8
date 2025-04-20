
import { createClient } from '@supabase/supabase-js';

// Use the actual Supabase project URL and anon key for your project
const supabaseUrl = 'https://bmkhbqxukiakhafqllux.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJta2hicXh1a2lha2hhZnFsbHV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0ODY2OTksImV4cCI6MjA1OTA2MjY5OX0.uqt5fokVkLgGQOlqF2BLiMgW4ZSy9gxkZXy35o97iXI';

// Create a single supabase client for the entire app
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});
