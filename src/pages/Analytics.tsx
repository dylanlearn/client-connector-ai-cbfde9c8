
import { BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/components/layout/DashboardLayout";

const Analytics = () => {
  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 md:mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Analytics</h1>
        <Button variant="outline">
          <BarChart3 className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Analytics</CardTitle>
          <CardDescription>
            Upgrade to Sync Pro to access detailed analytics about your projects and clients.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] md:h-[300px] flex items-center justify-center bg-gray-100 rounded-md">
            <div className="text-center px-4">
              <BarChart3 className="h-10 w-10 mx-auto text-gray-400 mb-4" />
              <h3 className="font-medium text-lg mb-2">Pro Feature</h3>
              <p className="text-gray-500 max-w-md mb-4 text-sm md:text-base">
                Gain insights into your design process with advanced analytics.
              </p>
              <Button>Upgrade to Pro</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Analytics;
