
import { useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/contexts/ProfileContext";

export const useAuthState = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { profile, isLoading: isProfileLoading, refetchProfile } = useProfile();

  useEffect(() => {
    let profileChannel: any = null;
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state change event:", event);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
      }
    );

    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsLoading(false);
    });

    // Set up real-time subscription for profile changes only if authenticated
    if (user?.id) {
      profileChannel = supabase
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
            // Refetch profile when changes are detected
            refetchProfile();
          }
        )
        .subscribe();
    }

    return () => {
      if (profileChannel) {
        supabase.removeChannel(profileChannel);
      }
      subscription.unsubscribe();
    };
  }, [user?.id, refetchProfile]);

  return {
    session,
    user,
    profile,
    isLoading: isLoading || isProfileLoading,
  };
};
