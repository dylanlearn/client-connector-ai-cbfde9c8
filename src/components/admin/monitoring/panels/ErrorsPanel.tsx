
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ErrorsPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Error Monitoring</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <p className="text-muted-foreground">No errors detected in the last 24 hours.</p>
        </div>
      </CardContent>
    </Card>
  );
}
