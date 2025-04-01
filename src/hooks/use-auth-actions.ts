
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { getRedirectUrl, getEmailConfirmationRedirectUrl } from "@/utils/auth-utils";

export const useAuthActions = (setProfile: (profile: any) => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Get the redirect path from location state, default to /dashboard
  const from = (location.state as { from?: string })?.from || "/dashboard";

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      toast({
        title: "Login successful",
        description: "Welcome back to DezignSync!",
      });
      
      // Navigate to the intended destination
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Error signing in:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
      
      const redirectUrl = getRedirectUrl();
      console.log("Google sign-in redirect URL:", redirectUrl);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        toast({
          title: "Google login failed",
          description: error.message,
          variant: "destructive",
        });
        console.error("Google OAuth error:", error);
        setIsLoading(false);
        throw error;
      }
      
      // Google OAuth flow will handle redirection
      // No need to navigate programmatically
    } catch (error) {
      console.error("Error in Google sign-in:", error);
      toast({
        title: "Google login error",
        description: "Could not connect to Google. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string, phoneNumber: string) => {
    try {
      setIsLoading(true);
      
      // Use the email confirmation redirect URL for signup
      const confirmationRedirectUrl = getEmailConfirmationRedirectUrl();
      console.log("Email confirmation redirect URL:", confirmationRedirectUrl);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            phone_number: phoneNumber,
          },
          emailRedirectTo: confirmationRedirectUrl,
        },
      });

      if (error) {
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      toast({
        title: "Account created",
        description: "Please check your email to confirm your account.",
      });
      
      navigate("/signup/confirmation", { state: { email } });
    } catch (error) {
      console.error("Error signing up:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast({
          title: "Sign out failed",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      setProfile(null);
      navigate("/"); // Redirect to landing page instead of login
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signIn,
    signInWithGoogle,
    signUp,
    signOut,
    isLoading
  };
};
