
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSubscription } from "@/hooks/use-subscription"; 
import { ShieldCheck, ShieldAlert, Activity, Database } from "lucide-react";

export const UserMenu = () => {
  const { user, signOut, profile } = useAuth();
  const { isAdmin } = useSubscription(); // Use the isAdmin state from subscription hook
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Direct check for admin status from profile for reliability
  const adminFromProfile = profile?.role === 'admin';
  
  // Combined admin status check for maximum reliability
  const isAdminUser = adminFromProfile || isAdmin;
  
  useEffect(() => {
    // Log admin status for debugging
    console.log("UserMenu - Admin status check:", { 
      "profile?.role": profile?.role, 
      "isAdmin from subscription": isAdmin,
      "combined isAdminUser": isAdminUser,
      "profile data": profile
    });
  }, [profile, isAdmin, isAdminUser]);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <motion.div 
          whileHover={{ scale: 1.1 }} 
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Avatar className="h-9 w-9 cursor-pointer">
            <AvatarImage src={profile?.avatar_url || user?.user_metadata?.avatar_url} alt={profile?.name || user?.user_metadata?.name} />
            <AvatarFallback>{profile?.name?.charAt(0).toUpperCase() || user?.user_metadata?.name?.charAt(0).toUpperCase() || "DS"}</AvatarFallback>
          </Avatar>
        </motion.div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{profile?.name || user?.user_metadata?.name || user?.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {isAdminUser && (
          <>
            <DropdownMenuItem onClick={() => navigate("/admin")} className="text-indigo-600">
              <ShieldCheck className="mr-2 h-4 w-4" />
              Admin Panel
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/admin-analytics")} className="text-indigo-600">
              <Activity className="mr-2 h-4 w-4" />
              Admin Analytics
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/admin-analytics?tab=supabase")} className="text-indigo-600">
              <Database className="mr-2 h-4 w-4" />
              System Audit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/admin-analytics?tab=health")} className="text-indigo-600">
              <ShieldAlert className="mr-2 h-4 w-4" />
              System Health
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        
        <DropdownMenuItem onClick={() => navigate("/settings")}>
          Account Settings
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/templates")}>
          Templates
        </DropdownMenuItem>
        {isMobile && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/dashboard")}>
              Dashboard
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/new-project")}>
              New Project
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/ai-design-suggestions")}>
              AI Assistant
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
