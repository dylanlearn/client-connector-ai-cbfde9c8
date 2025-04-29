
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EnterpriseAuthConfiguration } from '@/types/enterprise-auth';

interface LDAPConfigFormProps {
  configurations: EnterpriseAuthConfiguration[];
  onSave: (config: Partial<EnterpriseAuthConfiguration>) => Promise<void>;
  isLoading: boolean;
}

export const LDAPConfigForm: React.FC<LDAPConfigFormProps> = ({
  configurations,
  onSave,
  isLoading
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>LDAP Integration</CardTitle>
        <CardDescription>Configure LDAP authentication for your organization</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          LDAP configuration will be available in the next update. Please check back soon.
        </p>
      </CardContent>
    </Card>
  );
};
