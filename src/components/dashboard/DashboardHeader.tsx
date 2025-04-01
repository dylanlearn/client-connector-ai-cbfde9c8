
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Crown, Menu } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";

const DashboardHeader = () => {
  const { user, signOut, profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    // No need to navigate here as the signOut function now handles the redirect
  };

  // Determine if the user is on a pro plan - this would typically come from the user's subscription info
  const isPro = false; // Replace with actual logic to check if user has a Pro plan

  return (
    <motion.header 
      className="border-b bg-white"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="h-16 flex items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <div className="block md:hidden">
            <SidebarTrigger />
          </div>
          
          <nav className="hidden md:flex gap-4 md:gap-6 text-sm">
            <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
              <Link
                to="/dashboard"
                className={`hover:text-primary transition-colors ${
                  location.pathname === "/dashboard" ? "text-primary font-medium" : "text-muted-foreground"
                }`}
              >
                Dashboard
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
              <Link
                to="/new-project"
                className={`hover:text-primary transition-colors ${
                  location.pathname === "/new-project" ? "text-primary font-medium" : "text-muted-foreground"
                }`}
              >
                New Project
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
              <Link
                to="/ai-design-suggestions"
                className={`hover:text-primary transition-colors ${
                  location.pathname === "/ai-design-suggestions" ? "text-primary font-medium" : "text-muted-foreground"
                }`}
              >
                AI Assistant
              </Link>
            </motion.div>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Plan badge */}
          {isPro ? (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="hidden md:flex items-center gap-1 bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-medium"
            >
              <Crown size={12} className="mr-1" />
              Pro Plan
            </motion.div>
          ) : (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="outline" 
                size="sm" 
                className="hidden md:flex items-center gap-1 text-xs"
                onClick={() => navigate("/settings")}
              >
                <Crown size={12} className="mr-1" />
                Upgrade
              </Button>
            </motion.div>
          )}
          
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Avatar className="h-9 w-9 cursor-pointer">
                  <AvatarImage src={profile?.avatar_url || user?.user_metadata?.avatar_url} alt={profile?.name || user?.user_metadata?.name} />
                  <AvatarFallback>{profile?.name?.charAt(0).toUpperCase() || user?.user_metadata?.name?.charAt(0).toUpperCase() || "DS"}</AvatarFallback>
                </Avatar>
              </motion.div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{profile?.name || user?.user_metadata?.name || user?.email}</DropdownMenuLabel>
              <DropdownMenuSeparator />
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
        </div>
      </div>
    </motion.header>
  );
};

export default DashboardHeader;
