
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Crown, Menu } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";

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
    <header className="border-b bg-white">
      <div className="h-16 flex items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <div className="block md:hidden">
            <SidebarTrigger />
          </div>
          
          <nav className="hidden md:flex gap-4 md:gap-6 text-sm">
            <Link
              to="/dashboard"
              className={`hover:text-primary transition-colors ${
                location.pathname === "/dashboard" ? "text-primary font-medium" : "text-muted-foreground"
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/new-project"
              className={`hover:text-primary transition-colors ${
                location.pathname === "/new-project" ? "text-primary font-medium" : "text-muted-foreground"
              }`}
            >
              New Project
            </Link>
            <Link
              to="/ai-design-suggestions"
              className={`hover:text-primary transition-colors ${
                location.pathname === "/ai-design-suggestions" ? "text-primary font-medium" : "text-muted-foreground"
              }`}
            >
              AI Assistant
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Plan badge */}
          {isPro ? (
            <div className="hidden md:flex items-center gap-1 bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-medium">
              <Crown size={12} className="mr-1" />
              Pro Plan
            </div>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              className="hidden md:flex items-center gap-1 text-xs"
              onClick={() => navigate("/settings")}
            >
              <Crown size={12} className="mr-1" />
              Upgrade
            </Button>
          )}
          
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger>
              <Avatar className="h-9 w-9">
                <AvatarImage src={profile?.avatar_url || user?.user_metadata?.avatar_url} alt={profile?.name || user?.user_metadata?.name} />
                <AvatarFallback>{profile?.name?.charAt(0).toUpperCase() || user?.user_metadata?.name?.charAt(0).toUpperCase() || "DS"}</AvatarFallback>
              </Avatar>
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
    </header>
  );
};

export default DashboardHeader;
