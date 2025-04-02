
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface PricingHeaderProps {
  onDashboardClick: () => void;
  isAuthenticated: boolean;
}

export const PricingHeader = ({ onDashboardClick, isAuthenticated }: PricingHeaderProps) => {
  return (
    <header className="w-full py-4 px-6 flex justify-between items-center border-b bg-white/50 backdrop-blur-sm">
      <Link to="/" className="flex items-center gap-2">
        <svg viewBox="0 0 24 24" className="h-6 w-6 text-indigo-600" fill="currentColor">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
        <span className="font-bold text-xl">DezignSync</span>
      </Link>
      
      <div className="flex gap-4">
        {isAuthenticated ? (
          <Button variant="ghost" onClick={onDashboardClick}>
            Dashboard
          </Button>
        ) : (
          <>
            <Button variant="ghost" asChild>
              <Link to="/login">Login</Link>
            </Button>
          </>
        )}
      </div>
    </header>
  );
};
