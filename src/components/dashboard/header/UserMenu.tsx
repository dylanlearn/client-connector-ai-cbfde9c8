
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSubscription } from "@/hooks/use-subscription"; 
import { ShieldCheck, ShieldAlert, Activity, Database, Settings, LogOut, User, FileText } from "lucide-react";
import { logClientError } from "@/utils/monitoring/client-error-logger";

export const UserMenu = () => {
  const { user, signOut, profile } = useAuth();
  const { isAdmin, isAdminFromProfile } = useSubscription(); // Use the isAdmin state from subscription hook
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Direct check for admin status from profile for reliability
  const adminFromProfile = profile?.role === 'admin';
  
  // Combined admin status check for maximum reliability
  const isAdminUser = adminFromProfile || isAdmin || isAdminFromProfile;
  
  useEffect(() => {
    // Enhanced logging for better debugging
    console.log("UserMenu - Admin status check:", { 
      "profile?.role": profile?.role, 
      "isAdmin from subscription": isAdmin,
      "isAdminFromProfile": isAdminFromProfile,
      "combined isAdminUser": isAdminUser,
      "profile data": profile
    });
    
    // Log any potential issues with admin status detection
    if (profile?.role === 'admin' && !isAdminUser) {
      logClientError(
        "Admin status detection inconsistency", 
        "UserMenu", 
        user?.id, 
        { profile, isAdmin, isAdminFromProfile }
      );
    }
  }, [profile, isAdmin, isAdminFromProfile, isAdminUser, user?.id]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
      logClientError("Sign out error", "UserMenu", user?.id, { error });
    }
  };

  return (
    <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <motion.div 
          whileHover={{ scale: 1.05 }} 
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="cursor-pointer"
        >
          <Avatar className="h-9 w-9">
            <AvatarImage src={profile?.avatar_url || user?.user_metadata?.avatar_url} alt={profile?.name || user?.user_metadata?.name} />
            <AvatarFallback>{profile?.name?.charAt(0).toUpperCase() || user?.user_metadata?.name?.charAt(0).toUpperCase() || "DS"}</AvatarFallback>
          </Avatar>
        </motion.div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{profile?.name || user?.user_metadata?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => navigate("/settings")} className="cursor-pointer">
          <User className="mr-2 h-4 w-4" />
          Account Settings
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => navigate("/templates")} className="cursor-pointer">
          <FileText className="mr-2 h-4 w-4" />
          Templates
        </DropdownMenuItem>
        
        {isAdminUser && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground">
              Admin Controls
            </DropdownMenuLabel>
            
            <DropdownMenuItem onClick={() => navigate("/admin")} className="text-indigo-600 cursor-pointer">
              <ShieldCheck className="mr-2 h-4 w-4" />
              Admin Panel
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => navigate("/admin-analytics")} className="text-indigo-600 cursor-pointer">
              <Activity className="mr-2 h-4 w-4" />
              Admin Analytics
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => navigate("/admin-analytics?tab=supabase")} className="text-indigo-600 cursor-pointer">
              <Database className="mr-2 h-4 w-4" />
              System Audit
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => navigate("/admin-analytics?tab=health")} className="text-indigo-600 cursor-pointer">
              <ShieldAlert className="mr-2 h-4 w-4" />
              System Health
            </DropdownMenuItem>
          </>
        )}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-500 focus:text-red-500">
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
