
import { useState, useEffect } from "react";
import { Settings as SettingsIcon, User, Mail, Shield, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { enableRealtimeForTable } from "@/utils/auth-utils";
import { TabManager, TabItem } from "@/components/ui/tab-manager";
import ProfileSettings from "@/components/settings/ProfileSettings";
import SubscriptionSettings from "@/components/settings/SubscriptionSettings";

const Settings = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);

  // Enable realtime for the profiles table
  useEffect(() => {
    const setup = async () => {
      await enableRealtimeForTable('profiles');
    };
    setup();
  }, []);

  // Define tabs configuration
  const settingsTabs: TabItem[] = [
    {
      id: "profile",
      label: "Profile",
      content: <ProfileSettings 
        profile={profile} 
        user={user} 
        isLoading={isLoading} 
        setIsLoading={setIsLoading} 
      />,
      isLoading: false
    },
    {
      id: "subscription",
      label: "Subscription",
      content: <SubscriptionSettings />,
      isLoading: false
    }
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 md:mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Settings</h1>
        {activeTab === "profile" && (
          <Button 
            variant="outline" 
            onClick={() => {
              if (activeTab === "profile" && profile) {
                const profileSettings = document.getElementById("profile-form") as HTMLFormElement;
                if (profileSettings) {
                  profileSettings.dispatchEvent(new Event("submit", { cancelable: true }));
                }
              }
            }}
            disabled={isLoading}
          >
            <SettingsIcon className="mr-2 h-4 w-4" />
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        )}
      </div>

      <TabManager 
        tabs={settingsTabs}
        activeTab={activeTab} 
        onTabChange={handleTabChange}
        className="space-y-4"
      />
    </DashboardLayout>
  );
};

export default Settings;
