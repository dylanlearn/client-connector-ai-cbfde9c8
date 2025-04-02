
import { useState } from "react";
import { User, Mail, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";

interface ProfileSettingsProps {
  profile: any | null;
  user: SupabaseUser | null;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const ProfileSettings = ({ profile, user, isLoading, setIsLoading }: ProfileSettingsProps) => {
  const { toast } = useToast();
  const [name, setName] = useState(profile?.name || "");
  const [email, setEmail] = useState(profile?.email || "");
  const [role, setRole] = useState(profile?.role || "");

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ name })
        .eq('id', user.id);

      if (error) throw error;
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message || "An error occurred while updating your profile.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  return (
    <form id="profile-form" onSubmit={handleUpdateProfile}>
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>
            Manage your personal information and account details.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <User className="h-4 w-4" /> Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={handleNameChange}
              placeholder="Your name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" /> Email
            </Label>
            <Input
              id="email"
              value={email}
              disabled
              className="bg-gray-50"
            />
            <p className="text-xs text-gray-500">Your email address cannot be changed.</p>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <Label htmlFor="role" className="flex items-center gap-2">
              <Shield className="h-4 w-4" /> Account Type
            </Label>
            <Input
              id="role"
              value={role}
              disabled
              className="bg-gray-50"
            />
            <p className="text-xs text-gray-500">
              {role === 'sync' && "You have a basic Sync account."}
              {role === 'pro' && "You have a Pro account with advanced features."}
              {role === 'template_buyer' && "You have purchased templates."}
              {role === 'admin' && "You have administrator privileges."}
            </p>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};

export default ProfileSettings;
