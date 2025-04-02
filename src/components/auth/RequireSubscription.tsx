
import { Navigate, useLocation } from "react-router-dom";
import { useSubscription } from "@/hooks/use-subscription";
import { useAuth } from "@/hooks/use-auth";

interface RequireSubscriptionProps {
  children: React.ReactNode;
}

const RequireSubscription = ({ children }: RequireSubscriptionProps) => {
  const { isActive, isLoading } = useSubscription();
  const { user, isLoading: authLoading } = useAuth();
  const location = useLocation();
  
  // Don't redirect while things are loading
  if (isLoading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  // If user is not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  // If user is authenticated but doesn't have an active subscription, redirect to pricing
  if (!isActive) {
    return <Navigate to="/pricing" state={{ from: location.pathname }} replace />;
  }
  
  // Render children if user is authenticated and has an active subscription
  return <>{children}</>;
};

export default RequireSubscription;
