
import { useEffect, useState, useCallback, useRef } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/contexts/ProfileContext";

export const useAuthState = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { profile, isLoading: isProfileLoading, refetchProfile } = useProfile();
  
  // Track subscription to prevent memory leaks
  const profileChannelRef = useRef<any>(null);

  // Memoized profile refetch function to prevent unnecessary rerenders
  const handleProfileChange = useCallback(() => {
    if (user?.id) {
      console.log("Profile change detected, refreshing profile data");
      refetchProfile();
    }
  }, [user?.id, refetchProfile]);

  useEffect(() => {
    // Track if component is mounted
    let isMounted = true;
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state change event:", event);
        if (isMounted) {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
        }
      }
    );

    // Initial session check
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      if (isMounted) {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setIsLoading(false);
      }
    });

    // Clean up function
    return () => {
      isMounted = false;
      
      // Clean up previous subscription if it exists
      if (profileChannelRef.current) {
        supabase.removeChannel(profileChannelRef.current);
        profileChannelRef.current = null;
      }
      
      subscription.unsubscribe();
    };
  }, []); // Empty dependency array for one-time setup

  // Set up real-time subscription for profile changes only if authenticated
  useEffect(() => {
    // Only set up if we have a user and no existing subscription
    if (user?.id && !profileChannelRef.current) {
      // Clean up any existing channel first
      if (profileChannelRef.current) {
        supabase.removeChannel(profileChannelRef.current);
      }
      
      // Create new subscription
      profileChannelRef.current = supabase
        .channel('public:profiles')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'profiles',
            filter: `id=eq.${user.id}`,
          },
          (payload) => {
            console.log('Profile updated in real-time:', payload);
            // Use setTimeout to avoid React state update conflicts
            setTimeout(() => {
              handleProfileChange();
            }, 0);
          }
        )
        .subscribe();
    }
    
    // Clean up function
    return () => {
      if (profileChannelRef.current) {
        supabase.removeChannel(profileChannelRef.current);
        profileChannelRef.current = null;
      }
    };
  }, [user?.id, handleProfileChange]); // Dependencies for setting up subscription when user changes

  return {
    session,
    user,
    profile,
    isLoading: isLoading || isProfileLoading,
  };
};
