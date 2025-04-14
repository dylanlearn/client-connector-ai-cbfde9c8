
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, CheckCircle, XCircle } from 'lucide-react';
import { getSystemStatus } from '@/utils/monitoring/system-status';

export function MonitoringState() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">System Monitoring Active</CardTitle>
        <Badge variant="default" className="bg-green-500 hover:bg-green-600">Live</Badge>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="grid gap-1">
            <h3 className="font-medium leading-none">All systems operational</h3>
            <p className="text-sm text-muted-foreground">
              Data is being captured and analyzed
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
