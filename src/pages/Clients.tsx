
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/dashboard/EmptyState";
import DashboardLayout from "@/components/layout/DashboardLayout";

const Clients = () => {
  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 md:mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Clients</h1>
        <Button>
          <Users className="mr-2 h-4 w-4" />
          Invite Client
        </Button>
      </div>

      <EmptyState 
        title="No clients yet"
        description="Invite clients to collaborate on your projects."
        buttonText="Invite Client"
        buttonAction={() => {}}
        icon={Users}
      />
    </DashboardLayout>
  );
};

export default Clients;
