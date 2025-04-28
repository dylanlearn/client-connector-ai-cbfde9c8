
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';

export function ValidationRulesList() {
  const { data: rules, isLoading } = useQuery({
    queryKey: ['validation-rules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('wireframe_validation_rules')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <div>Loading validation rules...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Validation Rules</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rules?.map((rule) => (
              <TableRow key={rule.id}>
                <TableCell>{rule.name}</TableCell>
                <TableCell>{rule.rule_type}</TableCell>
                <TableCell>
                  <Badge 
                    variant={rule.severity === 'error' ? 'destructive' : 
                           rule.severity === 'warning' ? 'default' : 'secondary'}>
                    {rule.severity}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={rule.is_active ? 'default' : 'outline'}>
                    {rule.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
