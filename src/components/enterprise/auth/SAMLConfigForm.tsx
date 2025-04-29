
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { EnterpriseAuthConfiguration } from '@/types/enterprise-auth';
import { Loader2, PlusCircle } from 'lucide-react';

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
  const [editMode, setEditMode] = useState<boolean>(false);
  const [selectedConfig, setSelectedConfig] = useState<EnterpriseAuthConfiguration | null>(
    configurations.length > 0 ? configurations[0] : null
  );
  
  const [formData, setFormData] = useState({
    id: selectedConfig?.id || '',
    provider_name: selectedConfig?.provider_name || '',
    entityId: selectedConfig?.configuration?.entityId || '',
    assertionConsumerServiceURL: selectedConfig?.configuration?.assertionConsumerServiceURL || '',
    idpEntityId: selectedConfig?.configuration?.idpEntityId || '',
    idpSingleSignOnServiceURL: selectedConfig?.configuration?.idpSingleSignOnServiceURL || '',
    idpCertificate: selectedConfig?.configuration?.idpCertificate || '',
    is_active: selectedConfig?.is_active || true,
    is_default: selectedConfig?.is_default || false,
    organization_id: selectedConfig?.organization_id || '11111111-1111-1111-1111-111111111111' // Default placeholder
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string) => (checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const configData: Partial<EnterpriseAuthConfiguration> = {
      id: formData.id || undefined,
      provider_name: formData.provider_name,
      auth_type: 'saml',
      organization_id: formData.organization_id,
      is_active: formData.is_active,
      is_default: formData.is_default,
      configuration: {
        entityId: formData.entityId,
        assertionConsumerServiceURL: formData.assertionConsumerServiceURL,
        idpEntityId: formData.idpEntityId,
        idpSingleSignOnServiceURL: formData.idpSingleSignOnServiceURL,
        idpCertificate: formData.idpCertificate
      }
    };
    
    await onSave(configData);
    setEditMode(false);
  };

  const handleAddNew = () => {
    setFormData({
      id: '',
      provider_name: '',
      entityId: '',
      assertionConsumerServiceURL: '',
      idpEntityId: '',
      idpSingleSignOnServiceURL: '',
      idpCertificate: '',
      is_active: true,
      is_default: false,
      organization_id: '11111111-1111-1111-1111-111111111111' // Default placeholder
    });
    setSelectedConfig(null);
    setEditMode(true);
  };

  const handleSelectConfig = (config: EnterpriseAuthConfiguration) => {
    setSelectedConfig(config);
    setFormData({
      id: config.id,
      provider_name: config.provider_name,
      entityId: config.configuration.entityId || '',
      assertionConsumerServiceURL: config.configuration.assertionConsumerServiceURL || '',
      idpEntityId: config.configuration.idpEntityId || '',
      idpSingleSignOnServiceURL: config.configuration.idpSingleSignOnServiceURL || '',
      idpCertificate: config.configuration.idpCertificate || '',
      is_active: config.is_active,
      is_default: config.is_default,
      organization_id: config.organization_id
    });
    setEditMode(false);
  };

  return (
    <div className="grid gap-4">
      {configurations.length > 0 && !editMode ? (
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">SAML Configurations</h3>
            <Button onClick={handleAddNew}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New
            </Button>
          </div>
          <div className="grid gap-2">
            {configurations.map((config) => (
              <Card 
                key={config.id} 
                className={`cursor-pointer hover:bg-muted transition-colors ${selectedConfig?.id === config.id ? 'border-primary' : ''}`}
                onClick={() => handleSelectConfig(config)}
              >
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">{config.provider_name}</CardTitle>
                  <CardDescription>
                    {config.is_active ? 'Active' : 'Inactive'} • 
                    {config.is_default ? ' Default provider' : ' Secondary provider'}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>{formData.id ? 'Edit' : 'Add'} SAML Configuration</CardTitle>
              <CardDescription>
                Configure SAML authentication for your organization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="provider_name">Provider Name</Label>
                <Input
                  id="provider_name"
                  name="provider_name"
                  value={formData.provider_name}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Okta, Azure AD"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="entityId">Entity ID (SP)</Label>
                  <Input
                    id="entityId"
                    name="entityId"
                    value={formData.entityId}
                    onChange={handleChange}
                    required
                    placeholder="https://app.example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assertionConsumerServiceURL">ACS URL</Label>
                  <Input
                    id="assertionConsumerServiceURL"
                    name="assertionConsumerServiceURL"
                    value={formData.assertionConsumerServiceURL}
                    onChange={handleChange}
                    required
                    placeholder="https://app.example.com/api/auth/saml/callback"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="idpEntityId">IdP Entity ID</Label>
                  <Input
                    id="idpEntityId"
                    name="idpEntityId"
                    value={formData.idpEntityId}
                    onChange={handleChange}
                    required
                    placeholder="https://idp.example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="idpSingleSignOnServiceURL">IdP SSO URL</Label>
                  <Input
                    id="idpSingleSignOnServiceURL"
                    name="idpSingleSignOnServiceURL"
                    value={formData.idpSingleSignOnServiceURL}
                    onChange={handleChange}
                    required
                    placeholder="https://idp.example.com/saml2/sso"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="idpCertificate">IdP Certificate</Label>
                <Textarea
                  id="idpCertificate"
                  name="idpCertificate"
                  value={formData.idpCertificate}
                  onChange={handleChange}
                  required
                  placeholder="-----BEGIN CERTIFICATE-----&#10;...&#10;-----END CERTIFICATE-----"
                  rows={5}
                  className="font-mono text-xs"
                />
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="is_active" 
                    checked={formData.is_active} 
                    onCheckedChange={handleSwitchChange('is_active')} 
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="is_default" 
                    checked={formData.is_default} 
                    onCheckedChange={handleSwitchChange('is_default')} 
                  />
                  <Label htmlFor="is_default">Default provider</Label>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  if (selectedConfig) {
                    handleSelectConfig(selectedConfig);
                  } else {
                    setEditMode(false);
                  }
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Configuration
              </Button>
            </CardFooter>
          </Card>
        </form>
      )}
      
      {selectedConfig && !editMode && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>{selectedConfig.provider_name}</CardTitle>
            <CardDescription>
              {selectedConfig.is_active ? 'Active' : 'Inactive'} • 
              {selectedConfig.is_default ? ' Default provider' : ' Secondary provider'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Entity ID (SP)</h4>
                <p className="text-sm">{selectedConfig.configuration.entityId}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">ACS URL</h4>
                <p className="text-sm">{selectedConfig.configuration.assertionConsumerServiceURL}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">IdP Entity ID</h4>
                <p className="text-sm">{selectedConfig.configuration.idpEntityId}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">IdP SSO URL</h4>
                <p className="text-sm">{selectedConfig.configuration.idpSingleSignOnServiceURL}</p>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">IdP Certificate</h4>
              <pre className="text-xs font-mono bg-muted p-2 rounded overflow-x-auto">
                {selectedConfig.configuration.idpCertificate}
              </pre>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditMode(true)}>Edit</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};
