
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export interface DashboardTabsOptions {
  defaultTab?: string;
  persistState?: boolean;
}

export function useDashboardTabs(options: DashboardTabsOptions = {}) {
  const defaultOptions = {
    defaultTab: 'overview',
    persistState: true,
    ...options
  };

  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem('dashboardActiveTab') || defaultOptions.defaultTab
  );
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Check for tab query param and update if present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    
    if (tabParam && ['overview', 'clients', 'stats', 'tips'].includes(tabParam)) {
      setActiveTab(tabParam);
      if (defaultOptions.persistState) {
        localStorage.setItem('dashboardActiveTab', tabParam);
      }
    }
  }, [location.search, defaultOptions.persistState]);

  // Enable realtime updates for the database tables we use
  useEffect(() => {
    if (!user) return;

    // Enable realtime for client-related tables
    const setupRealtimeSubscriptions = async () => {
      // Enable realtime for the client_access_links table
      const clientLinksChannel = supabase.channel('public:client_access_links')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'client_access_links',
            filter: `designer_id=eq.${user.id}`
          },
          (payload) => {
            console.log('Client links changed:', payload);
          }
        )
        .subscribe();

      // Enable realtime for the client_tasks table
      const clientTasksChannel = supabase.channel('public:client_tasks')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'client_tasks'
          },
          (payload) => {
            console.log('Client tasks changed:', payload);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(clientLinksChannel);
        supabase.removeChannel(clientTasksChannel);
      };
    };

    const cleanup = setupRealtimeSubscriptions();
    return () => {
      cleanup.then(cleanupFn => {
        if (cleanupFn) cleanupFn();
      });
    };
  }, [user]);

  const handleTabChange = (value: string) => {
    setLoading(true);
    setActiveTab(value);
    
    // Update URL query parameter
    const params = new URLSearchParams(location.search);
    params.set('tab', value);
    navigate({ search: params.toString() }, { replace: true });
    
    // Persist state if enabled
    if (defaultOptions.persistState) {
      localStorage.setItem('dashboardActiveTab', value);
    }
    
    // Simulate loading state for tab content
    setTimeout(() => {
      setLoading(false);
    }, 300);
  };

  return {
    activeTab,
    loading,
    handleTabChange
  };
}
