
import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import WireframeEditor from "@/components/wireframe/WireframeEditor";
import { ComponentRegistration } from "@/components/wireframe/registry/ComponentRegistration";

const WireframeGenerator = () => {
  return (
    <DashboardLayout>
      <ComponentRegistration />
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Wireframe Generator</h1>
          <p className="text-muted-foreground">
            Create wireframes by selecting components and customizing your layout
          </p>
        </div>

        <WireframeEditor />
      </div>
    </DashboardLayout>
  );
};

export default WireframeGenerator;
