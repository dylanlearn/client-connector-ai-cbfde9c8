
import { useIsMobile } from "@/hooks/use-mobile";
import QuickStats from "./QuickStats";
import UpgradeCard from "./UpgradeCard";
import RecentProjects from "./RecentProjects";

interface OverviewTabProps {
  projects: any[];
}

const OverviewTab = ({ projects }: OverviewTabProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <QuickStats projectCount={projects.length} />
        <UpgradeCard />
      </div>

      <div className="mb-6">
        <RecentProjects projects={projects} />
      </div>
    </div>
  );
};

export default OverviewTab;
