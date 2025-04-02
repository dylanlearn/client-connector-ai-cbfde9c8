
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { useIsMobile } from "@/hooks/use-mobile";
import { ShieldCheck } from "lucide-react";

export const UserMenu = () => {
  const { user, signOut, profile } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  // Check if user has admin role
  const isAdmin = profile?.role === "admin";

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
        
        {isAdmin && (
          <DropdownMenuItem onClick={() => navigate("/admin")} className="text-indigo-600">
            <ShieldCheck className="mr-2 h-4 w-4" />
            Admin Panel
          </DropdownMenuItem>
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
