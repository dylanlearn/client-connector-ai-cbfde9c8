
import { motion } from "framer-motion";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { HeaderNavLinks } from "./header/HeaderNavLinks";
import { PlanBadge } from "./header/PlanBadge";
import { UserMenu } from "./header/UserMenu";

const DashboardHeader = () => {
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
          <HeaderNavLinks />
        </div>
        
        <div className="flex items-center gap-4">
          <PlanBadge isPro={isPro} />
          <UserMenu />
        </div>
      </div>
    </motion.header>
  );
};

export default DashboardHeader;
