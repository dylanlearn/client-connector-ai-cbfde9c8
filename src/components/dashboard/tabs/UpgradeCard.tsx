
import { useIsMobile } from "@/hooks/use-mobile";
import { useSubscription } from "@/hooks/use-subscription";
import { useAuth } from "@/hooks/use-auth";
import { AdminAccessCard } from "./subscription/AdminAccessCard";
import { SubscriptionCard } from "./subscription/SubscriptionCard";
import { useEffect } from "react";

const UpgradeCard = () => {
  const isMobile = useIsMobile();
  const { status, inTrial, isAdmin, isAdminFromProfile } = useSubscription();
  const { profile } = useAuth();
  
  // Multiple redundant checks for admin status to ensure reliability
  const isAdminUser = profile?.role === 'admin' || isAdmin || isAdminFromProfile;
  
  // Enhanced logging for debugging admin status issues
  useEffect(() => {
    console.log("UpgradeCard - Admin status details:", { 
      "profile?.role": profile?.role, 
      "isAdmin from subscription": isAdmin,
      "isAdminFromProfile": isAdminFromProfile,
      "combined isAdminUser": isAdminUser,
      "profile data": profile
    });
  }, [profile, isAdmin, isAdminFromProfile, isAdminUser]);
  
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
