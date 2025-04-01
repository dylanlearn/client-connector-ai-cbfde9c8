
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

export const fetchUserProfile = async (userId: string) => {
  try {
    console.log("Fetching profile for user:", userId);
    const { data, error } = await supabase
      .from('profiles')
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }

    console.log("Profile data retrieved:", data);
    return data;
  } catch (error) {
    console.error("Error in fetchUserProfile:", error);
    return null;
  }
};

export const getRedirectUrl = () => {
  return "https://client-connector-ai.lovable.app/dashboard";
};

// Add a specific function for email confirmation redirect
export const getEmailConfirmationRedirectUrl = () => {
  return "https://client-connector-ai.lovable.app/login?confirmed=true";
};
