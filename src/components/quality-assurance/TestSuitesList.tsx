
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';

export function TestSuitesList() {
  const { data: testSuites, isLoading } = useQuery({
    queryKey: ['test-suites'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('wireframe_test_suites')
        .select('*, wireframe_tests(count)');
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <div>Loading test suites...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Suites</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Tests</TableHead>
              <TableHead>Last Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {testSuites?.map((suite) => (
              <TableRow key={suite.id}>
                <TableCell>{suite.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{suite.test_type}</Badge>
                </TableCell>
                <TableCell>{suite.wireframe_tests.count}</TableCell>
                <TableCell>{new Date(suite.updated_at).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
