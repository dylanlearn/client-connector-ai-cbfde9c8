
import { useAuth } from "@/hooks/use-auth";
import DashboardLayout from "@/components/layout/DashboardLayout";

const Dashboard = () => {
  const { user } = useAuth();
  
  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Welcome{user?.user_metadata?.name ? `, ${user.user_metadata.name}` : ''}!</h2>
          <p className="text-gray-600">
            This is your dashboard where you can manage your projects and access all features.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
