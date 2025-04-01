
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";

const DashboardHeader = () => {
  const { user, signOut, profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    // No need to navigate here as the signOut function now handles the redirect
  };

  return (
    <header className="border-b">
      <div className="h-16 flex items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="flex items-center gap-2">
            <svg viewBox="0 0 24 24" className="h-6 w-6 text-indigo-600" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span className="font-bold hidden md:inline-block">DezignSync</span>
          </Link>
          <nav className="flex gap-4 md:gap-6 text-sm">
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
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger>
              <Avatar className="h-9 w-9">
                <AvatarImage src={profile?.avatar_url || user?.user_metadata?.avatar_url} alt={profile?.name || user?.user_metadata?.name} />
                <AvatarFallback>{profile?.name?.charAt(0).toUpperCase() || user?.user_metadata?.name?.charAt(0).toUpperCase() || "DS"}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{profile?.name || user?.user_metadata?.name}</DropdownMenuLabel>
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
