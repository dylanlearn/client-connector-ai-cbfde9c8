
import { useIsMobile } from "@/hooks/use-mobile";
import { useSubscription } from "@/hooks/use-subscription";
import { useAuth } from "@/hooks/use-auth";
import { AdminAccessCard } from "./subscription/AdminAccessCard";
import { SubscriptionCard } from "./subscription/SubscriptionCard";

const UpgradeCard = () => {
  const isMobile = useIsMobile();
  const { status, inTrial, isAdmin } = useSubscription();
  const { profile } = useAuth();
  
  // Direct check for admin status from profile
  const isAdminUser = profile?.role === 'admin' || isAdmin;
  
  console.log("UpgradeCard - Admin status:", { 
    "profile?.role": profile?.role, 
    "isAdmin from subscription": isAdmin,
    "combined isAdminUser": isAdminUser 
  });
  
  // Early return for admin users
  if (isAdminUser) {
    return <AdminAccessCard isMobile={isMobile} />;
  }
  
  return (
    <SubscriptionCard 
      isMobile={isMobile} 
      status={status} 
      inTrial={inTrial} 
    />
  );
};

export default UpgradeCard;
