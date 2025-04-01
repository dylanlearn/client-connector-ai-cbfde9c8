
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import EmptyState from "@/components/dashboard/EmptyState";
import { BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const StatsTab = () => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Statistics</CardTitle>
        <CardDescription>
          Overview of your activity and engagement
        </CardDescription>
      </CardHeader>
      <CardContent>
        <EmptyState 
          title="No statistics yet"
          description="Complete your first project to see statistics."
          buttonText="Create Project"
          buttonAction={() => navigate("/new-project")}
          icon={BarChart3}
        />
      </CardContent>
    </Card>
  );
};

export default StatsTab;
