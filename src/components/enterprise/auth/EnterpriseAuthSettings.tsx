
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EnterpriseAuthService } from '@/services/enterprise/EnterpriseAuthService';
import { EnterpriseAuthConfiguration } from '@/types/enterprise-auth';
import { SAMLConfigForm } from './SAMLConfigForm';
import { LDAPConfigForm } from './LDAPConfigForm';
import { OAuthConfigForm } from './OAuthConfigForm';
import { MFASettings } from './MFASettings';
import { Button } from '@/components/ui/button';
import { PlusCircle, RefreshCcw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export const EnterpriseAuthSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('saml');
  const [isLoading, setIsLoading] = useState(false);
  const [configurations, setConfigurations] = useState<EnterpriseAuthConfiguration[]>([]);
  const { toast } = useToast();

  const loadConfigurations = async () => {
    setIsLoading(true);
    try {
      const configs = await EnterpriseAuthService.getAuthConfigurations();
      setConfigurations(configs);
    } catch (error) {
      toast({
        title: "Failed to load auth configurations",
        description: "There was an error loading the enterprise authentication configurations",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadConfigurations();
  }, []);

  const handleSaveConfiguration = async (config: Partial<EnterpriseAuthConfiguration>) => {
    setIsLoading(true);
    try {
      await EnterpriseAuthService.saveAuthConfiguration(config);
      loadConfigurations();
      toast({
        title: "Configuration saved",
        description: "The authentication configuration was saved successfully"
      });
    } catch (error) {
      toast({
        title: "Failed to save configuration",
        description: "There was an error saving the authentication configuration",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Enterprise Authentication</CardTitle>
          <CardDescription>
            Configure enterprise authentication methods including SSO, LDAP, and MFA
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadConfigurations}
            disabled={isLoading}
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="saml">SAML</TabsTrigger>
            <TabsTrigger value="ldap">LDAP</TabsTrigger>
            <TabsTrigger value="oauth">OAuth/OIDC</TabsTrigger>
            <TabsTrigger value="mfa">Multi-Factor Auth</TabsTrigger>
          </TabsList>

          <TabsContent value="saml">
            <SAMLConfigForm 
              configurations={configurations.filter(c => c.auth_type === 'saml')}
              onSave={handleSaveConfiguration}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="ldap">
            <LDAPConfigForm 
              configurations={configurations.filter(c => c.auth_type === 'ldap')}
              onSave={handleSaveConfiguration}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="oauth">
            <OAuthConfigForm 
              configurations={configurations.filter(c => c.auth_type === 'oauth2' || c.auth_type === 'oidc')}
              onSave={handleSaveConfiguration}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="mfa">
            <MFASettings />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
