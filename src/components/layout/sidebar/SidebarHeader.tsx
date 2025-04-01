
import { LayoutDashboard } from "lucide-react";

const SidebarHeader = () => {
  return (
    <div className="flex items-center px-2">
      <div className="w-8 h-8 rounded-full bg-indigo-500 mr-2 flex items-center justify-center text-white">
        <LayoutDashboard size={18} />
      </div>
      <span className="font-semibold text-lg">DezignSync</span>
    </div>
  );
};

export default SidebarHeader;
