
import { SidebarTrigger } from "@/components/ui/sidebar";
import { HeaderNavLinks } from "./header/HeaderNavLinks";
import { PlanBadge } from "./header/PlanBadge";
import { UserMenu } from "./header/UserMenu";

const DashboardHeader = () => {
  // Determine if the user is on a pro plan - this would typically come from the user's subscription info
  const isPro = false; // Replace with actual logic to check if user has a Pro plan

  return (
    <header className="border-b bg-white">
      <div className="flex items-center justify-between px-4 md:px-6 h-16">
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
    </header>
  );
};

export default DashboardHeader;
