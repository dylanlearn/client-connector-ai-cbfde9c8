
import { useState, useEffect } from "react";

const LAST_TAB_KEY = "lastDashboardTab";

export const useDashboardTabs = () => {
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem(LAST_TAB_KEY) || "overview";
  });
  const [loading, setLoading] = useState(false);

  // Store active tab in localStorage
  useEffect(() => {
    localStorage.setItem(LAST_TAB_KEY, activeTab);
  }, [activeTab]);

  // Handle tab change with loading state and scroll to top
  const handleTabChange = (value: string) => {
    setLoading(true);
    setActiveTab(value);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Simulate loading time (remove this in production and replace with actual data fetching)
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  return {
    activeTab,
    loading,
    handleTabChange
  };
};
