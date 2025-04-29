
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { EnterpriseAuthConfiguration } from '@/types/enterprise-auth';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Save, Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

interface SAMLConfigFormProps {
  configurations: EnterpriseAuthConfiguration[];
  onSave: (config: Partial<EnterpriseAuthConfiguration>) => Promise<void>;
  isLoading: boolean;
}

export const SAMLConfigForm: React.FC<SAMLConfigFormProps> = ({
  configurations,
  onSave,
  isLoading
}) => {
  const samlConfigs = configurations || [];
  const [activeTab, setActiveTab] = useState(samlConfigs.length > 0 ? samlConfigs[0]?.id : 'new');
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<EnterpriseAuthConfiguration>>({
    auth_type: 'saml',
    provider_name: '',
    configuration: {
      entityId: '',
      assertionConsumerServiceURL: '',
      idpEntityId: '',
      idpSingleSignOnServiceURL: '',
      idpCertificate: ''
    },
    is_active: true,
    is_default: false,
    organization_id: '00000000-0000-0000-0000-000000000000' // Default org ID, should be replaced with actual org ID
  });

  const handleConfigChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...(formData[parent as keyof typeof formData] as Record<string, any>),
          [child]: value
        }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData({ ...formData, [name]: checked });
  };

  const handleSave = async () => {
    try {
      await onSave(formData);
      toast({
        title: 'SAML configuration saved',
        description: 'Your SAML configuration has been saved successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'There was an error saving your SAML configuration.',
        variant: 'destructive',
      });
    }
  };

  const handleTabChange = (value: string) => {
    if (value === 'new') {
      setFormData({
        auth_type: 'saml',
        provider_name: '',
        configuration: {
          entityId: '',
          assertionConsumerServiceURL: '',
          idpEntityId: '',
          idpSingleSignOnServiceURL: '',
          idpCertificate: ''
        },
        is_active: true,
        is_default: false,
        organization_id: '00000000-0000-0000-0000-000000000000'
      });
    } else {
      const selectedConfig = samlConfigs.find(c => c.id === value);
      if (selectedConfig) {
        setFormData(selectedConfig);
      }
    }
    setActiveTab(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>SAML Integration</CardTitle>
        <CardDescription>Configure SAML authentication for your organization</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="mb-4">
            {samlConfigs.map(config => (
              <TabsTrigger key={config.id} value={config.id}>
                {config.provider_name}
              </TabsTrigger>
            ))}
            <TabsTrigger value="new">
              <Plus className="h-4 w-4 mr-2" />
              New
            </TabsTrigger>
          </TabsList>

          {samlConfigs.map(config => (
            <TabsContent key={config.id} value={config.id}>
              <div className="space-y-6">
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="provider_name">Provider Name</Label>
                      <Input
                        id="provider_name"
                        name="provider_name"
                        placeholder="e.g. Okta, Auth0"
                        value={formData.provider_name || config.provider_name}
                        onChange={handleConfigChange}
                      />
                    </div>
                    
                    <div className="flex items-center justify-end space-x-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="is_active"
                          checked={formData.is_active ?? config.is_active}
                          onCheckedChange={(checked) => handleSwitchChange('is_active', checked)}
                        />
                        <Label htmlFor="is_active">Active</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="is_default"
                          checked={formData.is_default ?? config.is_default}
                          onCheckedChange={(checked) => handleSwitchChange('is_default', checked)}
                        />
                        <Label htmlFor="is_default">Default</Label>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <h3 className="text-lg font-medium">Service Provider Settings</h3>
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="configuration.entityId">Entity ID</Label>
                      <Input
                        id="configuration.entityId"
                        name="configuration.entityId"
                        placeholder="https://your-app.com"
                        value={(formData.configuration as any)?.entityId || (config.configuration as any).entityId}
                        onChange={handleConfigChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="configuration.assertionConsumerServiceURL">Assertion Consumer Service URL</Label>
                      <Input
                        id="configuration.assertionConsumerServiceURL"
                        name="configuration.assertionConsumerServiceURL"
                        placeholder="https://your-app.com/api/auth/saml/callback"
                        value={(formData.configuration as any)?.assertionConsumerServiceURL || (config.configuration as any).assertionConsumerServiceURL}
                        onChange={handleConfigChange}
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <h3 className="text-lg font-medium">Identity Provider Settings</h3>
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="configuration.idpEntityId">IdP Entity ID</Label>
                      <Input
                        id="configuration.idpEntityId"
                        name="configuration.idpEntityId"
                        placeholder="https://idp-provider.com"
                        value={(formData.configuration as any)?.idpEntityId || (config.configuration as any).idpEntityId}
                        onChange={handleConfigChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="configuration.idpSingleSignOnServiceURL">IdP Single Sign-On Service URL</Label>
                      <Input
                        id="configuration.idpSingleSignOnServiceURL"
                        name="configuration.idpSingleSignOnServiceURL"
                        placeholder="https://idp-provider.com/sso"
                        value={(formData.configuration as any)?.idpSingleSignOnServiceURL || (config.configuration as any).idpSingleSignOnServiceURL}
                        onChange={handleConfigChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="configuration.idpCertificate">IdP Certificate</Label>
                      <Textarea
                        id="configuration.idpCertificate"
                        name="configuration.idpCertificate"
                        placeholder="-----BEGIN CERTIFICATE-----..."
                        rows={5}
                        value={(formData.configuration as any)?.idpCertificate || (config.configuration as any).idpCertificate}
                        onChange={handleConfigChange}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-4">
                    <Button onClick={handleSave} disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Configuration
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          ))}
          
          <TabsContent value="new">
            <div className="space-y-6">
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new_provider_name">Provider Name</Label>
                    <Input
                      id="new_provider_name"
                      name="provider_name"
                      placeholder="e.g. Okta, Auth0"
                      value={formData.provider_name || ""}
                      onChange={handleConfigChange}
                    />
                  </div>
                  
                  <div className="flex items-center justify-end space-x-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="new_is_active"
                        checked={formData.is_active === true}
                        onCheckedChange={(checked) => handleSwitchChange('is_active', checked)}
                      />
                      <Label htmlFor="new_is_active">Active</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="new_is_default"
                        checked={formData.is_default === true}
                        onCheckedChange={(checked) => handleSwitchChange('is_default', checked)}
                      />
                      <Label htmlFor="new_is_default">Default</Label>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <h3 className="text-lg font-medium">Service Provider Settings</h3>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new_configuration.entityId">Entity ID</Label>
                    <Input
                      id="new_configuration.entityId"
                      name="configuration.entityId"
                      placeholder="https://your-app.com"
                      value={(formData.configuration as any)?.entityId || ""}
                      onChange={handleConfigChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new_configuration.assertionConsumerServiceURL">Assertion Consumer Service URL</Label>
                    <Input
                      id="new_configuration.assertionConsumerServiceURL"
                      name="configuration.assertionConsumerServiceURL"
                      placeholder="https://your-app.com/api/auth/saml/callback"
                      value={(formData.configuration as any)?.assertionConsumerServiceURL || ""}
                      onChange={handleConfigChange}
                    />
                  </div>
                </div>
                
                <Separator />
                
                <h3 className="text-lg font-medium">Identity Provider Settings</h3>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new_configuration.idpEntityId">IdP Entity ID</Label>
                    <Input
                      id="new_configuration.idpEntityId"
                      name="configuration.idpEntityId"
                      placeholder="https://idp-provider.com"
                      value={(formData.configuration as any)?.idpEntityId || ""}
                      onChange={handleConfigChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new_configuration.idpSingleSignOnServiceURL">IdP Single Sign-On Service URL</Label>
                    <Input
                      id="new_configuration.idpSingleSignOnServiceURL"
                      name="configuration.idpSingleSignOnServiceURL"
                      placeholder="https://idp-provider.com/sso"
                      value={(formData.configuration as any)?.idpSingleSignOnServiceURL || ""}
                      onChange={handleConfigChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new_configuration.idpCertificate">IdP Certificate</Label>
                    <Textarea
                      id="new_configuration.idpCertificate"
                      name="configuration.idpCertificate"
                      placeholder="-----BEGIN CERTIFICATE-----..."
                      rows={5}
                      value={(formData.configuration as any)?.idpCertificate || ""}
                      onChange={handleConfigChange}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end pt-4">
                  <Button onClick={handleSave} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Configuration
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
