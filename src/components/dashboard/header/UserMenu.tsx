
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { useIsMobile } from "@/hooks/use-mobile";
import { ShieldCheck, Activity, Database, Settings, LogOut, User, FileText } from "lucide-react";
import { logError } from "@/utils/monitoring/client-error-logger";
import { useAdminStatus } from "@/hooks/use-admin-status"; // Switch to useAdminStatus hook

export const UserMenu = () => {
  const { user, signOut, profile } = useAuth();
  const { isAdmin } = useAdminStatus(); // Use the dedicated admin hook
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
      // Use the correctly exported logError function
      logError(
        error instanceof Error ? error : new Error("Sign out error"), 
        "UserMenu", 
        user?.id
      );
    }
  };
  
  const handleAdminPanelClick = () => {
    console.log("Navigating to admin panel. Current admin status:", { isAdmin, email: user?.email, role: profile?.role });
    navigate("/admin");
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
            <p className="text-sm font-medium">{profile?.name || user?.user_metadata?.name || user?.email}</p>
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
        
        {/* Admin menu items - shown based on admin status */}
        {isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground">
              Admin Controls
            </DropdownMenuLabel>
            
            <DropdownMenuItem onClick={handleAdminPanelClick} className="text-indigo-600 cursor-pointer">
              <ShieldCheck className="mr-2 h-4 w-4" />
              Admin Panel
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => navigate("/admin/analytics")} className="text-indigo-600 cursor-pointer">
              <Activity className="mr-2 h-4 w-4" />
              Admin Analytics
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => navigate("/admin/supabase-audit")} className="text-indigo-600 cursor-pointer">
              <Database className="mr-2 h-4 w-4" />
              Supabase Audit
            </DropdownMenuItem>
          </>
        )}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
