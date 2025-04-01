
import { PaintBucket, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/components/layout/DashboardLayout";
import EmptyState from "@/components/dashboard/EmptyState";

const Templates = () => {
  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 md:mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Template Marketplace</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Template
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Featured Templates</CardTitle>
          <CardDescription>
            Pre-made templates to jumpstart your design process
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState 
            title="Coming Soon"
            description="Our template marketplace will be available shortly. Stay tuned!"
            buttonText="Create Custom Template"
            buttonAction={() => {}}
            icon={PaintBucket}
          />
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Templates;
