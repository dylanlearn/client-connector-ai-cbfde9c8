
import { SidebarTrigger } from "@/components/ui/sidebar";
import { HeaderNavLinks } from "./header/HeaderNavLinks";
import { PlanBadge } from "./header/PlanBadge";
import { UserMenu } from "./header/UserMenu";
import { useSubscription } from "@/hooks/use-subscription";

const DashboardHeader = () => {
  const { status } = useSubscription();
  // Determine if the user is on a pro plan
  const isPro = status === 'sync-pro';

  return (
    <header className="border-b bg-white flex items-center justify-between px-4 md:px-6 h-16">
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
    </header>
  );
};

export default DashboardHeader;
