
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function PerformancePanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Monitoring</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Performance data will appear here.</p>
        </div>
      </CardContent>
    </Card>
  );
}
