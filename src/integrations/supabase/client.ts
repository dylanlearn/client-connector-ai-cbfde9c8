
import { createClient } from "@supabase/supabase-js";

// Default values for development or if env variables are missing
// In a real production app, you would want to handle this differently
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://bmkhbqxukiakhafqllux.supabase.co";
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJta2hicXh1a2lha2hhZnFsbHV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0ODY2OTksImV4cCI6MjA1OTA2MjY5OX0.uqt5fokVkLgGQOlqF2BLiMgW4ZSy9gxkZXy35o97iXI";

// Always log whether we're using the environment variables or fallbacks
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn("Using default Supabase credentials. For production, set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.");
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
