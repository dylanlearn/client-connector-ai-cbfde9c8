
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EnterpriseAuthConfiguration } from '@/types/enterprise-auth';

interface OAuthConfigFormProps {
  configurations: EnterpriseAuthConfiguration[];
  onSave: (config: Partial<EnterpriseAuthConfiguration>) => Promise<void>;
  isLoading: boolean;
}

export const OAuthConfigForm: React.FC<OAuthConfigFormProps> = ({
  configurations,
  onSave,
  isLoading
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>OAuth/OIDC Integration</CardTitle>
        <CardDescription>Configure OAuth and OpenID Connect authentication for your organization</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          OAuth and OIDC configuration will be available in the next update. Please check back soon.
        </p>
      </CardContent>
    </Card>
  );
};
