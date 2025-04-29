
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EnterpriseAuthSettings } from '@/components/enterprise/auth/EnterpriseAuthSettings';
import { AuditTrailTable } from '@/components/enterprise/audit/AuditTrailTable';
import { SystemAlerts } from '@/components/enterprise/audit/SystemAlerts';
import { StorageIntegrationsList } from '@/components/enterprise/storage/StorageIntegrationsList';
import DashboardLayout from "@/components/layout/DashboardLayout";
import { ShieldCheck, Database, List, Bell } from 'lucide-react';

const EnterpriseIntegrations: React.FC = () => {
  const [activeTab, setActiveTab] = useState('auth');
  
  return (
    <DashboardLayout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-2">Enterprise Integrations</h1>
        <p className="text-muted-foreground mb-8">
          Configure enterprise-grade authentication, audit trails, and storage integrations
        </p>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="w-full">
            <TabsTrigger value="auth" className="flex-1">
              <ShieldCheck className="mr-2 h-4 w-4" />
              Authentication
            </TabsTrigger>
            <TabsTrigger value="audit" className="flex-1">
              <List className="mr-2 h-4 w-4" />
              Audit Trail
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex-1">
              <Bell className="mr-2 h-4 w-4" />
              System Alerts
            </TabsTrigger>
            <TabsTrigger value="storage" className="flex-1">
              <Database className="mr-2 h-4 w-4" />
              Storage
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="auth" className="p-0">
            <EnterpriseAuthSettings />
          </TabsContent>
          
          <TabsContent value="audit" className="p-0">
            <Card>
              <CardHeader>
                <CardTitle>Comprehensive Audit Trail</CardTitle>
                <CardDescription>
                  Track all system activities with detailed logging for compliance reporting
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AuditTrailTable />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="alerts" className="p-0">
            <Card>
              <CardHeader>
                <CardTitle>System Alerts</CardTitle>
                <CardDescription>
                  Monitor and respond to system events and warnings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SystemAlerts />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="storage" className="p-0">
            <Card>
              <CardHeader>
                <CardTitle>Enterprise Storage Integration</CardTitle>
                <CardDescription>
                  Connect to enterprise storage solutions with version control, backup, and disaster recovery capabilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <StorageIntegrationsList />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default EnterpriseIntegrations;
