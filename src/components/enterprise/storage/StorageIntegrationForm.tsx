
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { StorageIntegration, StorageIntegrationType } from '@/types/enterprise-storage';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EnterpriseStorageService } from '@/services/enterprise/EnterpriseStorageService';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface StorageIntegrationFormProps {
  integration?: StorageIntegration | null;
  onSave: (integration: StorageIntegration) => void;
  onCancel: () => void;
}

export const StorageIntegrationForm: React.FC<StorageIntegrationFormProps> = ({
  integration,
  onSave,
  onCancel
}) => {
  const [integrationType, setIntegrationType] = useState<StorageIntegrationType>(
    integration?.integration_type || 's3'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: integration?.name || '',
    is_active: integration?.is_active ?? true,
    // S3 specific fields
    s3_bucket: integration?.integration_type === 's3' ? integration?.configuration?.bucket || '' : '',
    s3_region: integration?.integration_type === 's3' ? integration?.configuration?.region || '' : '',
    s3_access_key: integration?.integration_type === 's3' ? integration?.configuration?.access_key || '' : '',
    s3_secret_key: integration?.integration_type === 's3' ? integration?.configuration?.secret_key || '' : '',
    // GCS specific fields
    gcs_bucket: integration?.integration_type === 'gcs' ? integration?.configuration?.bucket || '' : '',
    gcs_project_id: integration?.integration_type === 'gcs' ? integration?.configuration?.project_id || '' : '',
    // Azure specific fields
    azure_container: integration?.integration_type === 'azure' ? integration?.configuration?.container || '' : '',
    azure_connection_string: integration?.integration_type === 'azure' ? integration?.configuration?.connection_string || '' : '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, is_active: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      let configuration: Record<string, any> = {};
      
      switch (integrationType) {
        case 's3':
          configuration = {
            bucket: formData.s3_bucket,
            region: formData.s3_region,
          };
          
          // Only include credentials if they're provided
          if (formData.s3_access_key) {
            configuration.access_key = formData.s3_access_key;
          }
          
          if (formData.s3_secret_key) {
            configuration.secret_key = formData.s3_secret_key;
          }
          break;
          
        case 'gcs':
          configuration = {
            bucket: formData.gcs_bucket,
            project_id: formData.gcs_project_id,
          };
          break;
          
        case 'azure':
          configuration = {
            container: formData.azure_container,
            connection_string: formData.azure_connection_string,
          };
          break;
          
        default:
          configuration = {};
      }
      
      const result = await EnterpriseStorageService.saveStorageIntegration(
        integrationType,
        formData.name,
        configuration
      );
      
      if (result) {
        onSave(result);
      }
    } catch (error) {
      console.error('Error saving storage integration:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{integration ? 'Edit' : 'Add'} Storage Integration</CardTitle>
        <CardDescription>
          Configure enterprise storage integration with backup and version control capabilities
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Integration Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Production S3 Storage"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="integration_type">Integration Type</Label>
              <Select 
                value={integrationType} 
                onValueChange={(value) => setIntegrationType(value as StorageIntegrationType)}
              >
                <SelectTrigger id="integration_type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="s3">Amazon S3</SelectItem>
                  <SelectItem value="gcs">Google Cloud Storage</SelectItem>
                  <SelectItem value="azure">Azure Blob Storage</SelectItem>
                  <SelectItem value="sftp">SFTP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="is_active" 
              checked={formData.is_active} 
              onCheckedChange={handleSwitchChange} 
            />
            <Label htmlFor="is_active">Active</Label>
          </div>
          
          <div>
            <Tabs value={integrationType} onValueChange={(value) => setIntegrationType(value as StorageIntegrationType)}>
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="s3">Amazon S3</TabsTrigger>
                <TabsTrigger value="gcs">Google Cloud Storage</TabsTrigger>
                <TabsTrigger value="azure">Azure Blob</TabsTrigger>
              </TabsList>
              
              <TabsContent value="s3" className="p-4 border rounded-md mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="s3_bucket">Bucket Name</Label>
                    <Input
                      id="s3_bucket"
                      name="s3_bucket"
                      value={formData.s3_bucket}
                      onChange={handleChange}
                      placeholder="my-bucket"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="s3_region">Region</Label>
                    <Input
                      id="s3_region"
                      name="s3_region"
                      value={formData.s3_region}
                      onChange={handleChange}
                      placeholder="us-east-1"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="s3_access_key">Access Key ID</Label>
                    <Input
                      id="s3_access_key"
                      name="s3_access_key"
                      type="password"
                      value={formData.s3_access_key}
                      onChange={handleChange}
                      placeholder="Enter access key ID"
                      autoComplete="off"
                    />
                    <p className="text-xs text-muted-foreground">Leave empty to keep existing credentials</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="s3_secret_key">Secret Access Key</Label>
                    <Input
                      id="s3_secret_key"
                      name="s3_secret_key"
                      type="password"
                      value={formData.s3_secret_key}
                      onChange={handleChange}
                      placeholder="Enter secret access key"
                      autoComplete="off"
                    />
                    <p className="text-xs text-muted-foreground">Leave empty to keep existing credentials</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="gcs" className="p-4 border rounded-md mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gcs_bucket">Bucket Name</Label>
                    <Input
                      id="gcs_bucket"
                      name="gcs_bucket"
                      value={formData.gcs_bucket}
                      onChange={handleChange}
                      placeholder="my-gcs-bucket"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="gcs_project_id">Project ID</Label>
                    <Input
                      id="gcs_project_id"
                      name="gcs_project_id"
                      value={formData.gcs_project_id}
                      onChange={handleChange}
                      placeholder="my-gcp-project"
                      required
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="azure" className="p-4 border rounded-md mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="azure_container">Container Name</Label>
                    <Input
                      id="azure_container"
                      name="azure_container"
                      value={formData.azure_container}
                      onChange={handleChange}
                      placeholder="my-container"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="azure_connection_string">Connection String</Label>
                    <Input
                      id="azure_connection_string"
                      name="azure_connection_string"
                      type="password"
                      value={formData.azure_connection_string}
                      onChange={handleChange}
                      placeholder="Enter Azure connection string"
                      autoComplete="off"
                    />
                    <p className="text-xs text-muted-foreground">Leave empty to keep existing credentials</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {integration ? "Update" : "Create"} Integration
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
