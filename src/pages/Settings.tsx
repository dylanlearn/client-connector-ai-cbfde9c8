import { useState } from "react";
import { Settings as SettingsIcon, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const { user, profile, signOut, isLoading } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(profile?.name || user?.user_metadata?.name || "");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      // Update profile logic would go here
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
      console.error("Error updating profile:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut?.();
      navigate("/login");
    } catch (error) {
      toast.error("Failed to sign out");
      console.error("Error signing out:", error);
    }
  };

  return (
    <DashboardLayout>
      <div className="container py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Settings</h1>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleUpdateProfile} disabled={isUpdating}>
              <SettingsIcon className="h-4 w-4 mr-2" />
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
            <Button variant="destructive" onClick={handleSignOut} disabled={isLoading}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
        
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Manage your account details and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} id="profile-form" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Display Name</Label>
                  <Input 
                    id="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="Enter your display name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    value={user?.email || ""} 
                    disabled 
                    placeholder="Your email address"
                  />
                  <p className="text-sm text-muted-foreground">Your email cannot be changed</p>
                </div>
              </form>
            </CardContent>
          </Card>
          
          <Card className="bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800">
            <CardHeader>
              <CardTitle className="text-rose-700 dark:text-rose-300">Danger Zone</CardTitle>
              <CardDescription className="text-rose-600 dark:text-rose-400">
                Actions here can't be undone
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-1">Sign out everywhere</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Sign out from all devices where you're currently logged in
                  </p>
                  <Button variant="destructive" onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
                <Separator />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
