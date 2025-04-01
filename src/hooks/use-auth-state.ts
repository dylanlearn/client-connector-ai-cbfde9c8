
import { useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { fetchUserProfile } from "@/utils/auth-utils";

export const useAuthState = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state change event:", event);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          setTimeout(() => {
            fetchUserProfile(currentSession.user.id).then(data => {
              setProfile(data);
            });
          }, 0);
        } else {
          setProfile(null);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        fetchUserProfile(currentSession.user.id).then(data => {
          setProfile(data);
        });
      }
      
      setIsLoading(false);
    });

    // Set up real-time subscription for profile changes
    const setupProfileSubscription = async () => {
      const channel = supabase
        .channel('public:profiles')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'profiles',
            filter: user ? `id=eq.${user.id}` : undefined,
          },
          (payload) => {
            console.log('Profile updated in real-time:', payload);
            setProfile(payload.new);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };

    let cleanup: (() => void) | undefined;
    if (user) {
      setupProfileSubscription().then(cleanupFn => {
        cleanup = cleanupFn;
      });
    }

    return () => {
      subscription.unsubscribe();
      if (cleanup) cleanup();
    };
  }, [user?.id]);

  return {
    session,
    user,
    profile,
    isLoading,
    setProfile
  };
};
