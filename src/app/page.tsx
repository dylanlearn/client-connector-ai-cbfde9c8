
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Building2, LineChart, ShieldCheck } from "lucide-react";
import WorkspaceManagement from "@/components/workspace/WorkspaceManagement";
import EnterpriseAnalyticsDashboard from "@/components/analytics/EnterpriseAnalyticsDashboard";
import ComplianceEnforcement from "@/components/compliance/ComplianceEnforcement";

export default function Home() {
  const [activeTab, setActiveTab] = useState('workspaces');

  return (
    <main className="min-h-screen">
      <Tabs defaultValue="workspaces" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="bg-card border-b p-2">
          <TabsList className="grid grid-cols-3 max-w-2xl mx-auto">
            <TabsTrigger value="workspaces">
              <Building2 className="mr-2 h-4 w-4" />
              Workspace Management
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <LineChart className="mr-2 h-4 w-4" />
              Analytics Dashboard
            </TabsTrigger>
            <TabsTrigger value="compliance">
              <ShieldCheck className="mr-2 h-4 w-4" />
              Compliance
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="workspaces">
          <WorkspaceManagement />
        </TabsContent>
        
        <TabsContent value="analytics">
          <EnterpriseAnalyticsDashboard />
        </TabsContent>
        
        <TabsContent value="compliance">
          <ComplianceEnforcement />
        </TabsContent>
      </Tabs>
    </main>
  );
}
