
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Bell, BellOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

export function AlertsPanel() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>System Alerts</span>
            <Badge variant="outline" className="ml-2">
              Configuration
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Alert Configuration</AlertTitle>
            <AlertDescription>
              Configure alerts to be notified when system events occur
            </AlertDescription>
          </Alert>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium">Error Rate Threshold</h3>
                <p className="text-sm text-muted-foreground">
                  Trigger an alert when error rate exceeds threshold
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="error-rate-alerts" />
                <span className="text-sm">5%</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium">Response Time Threshold</h3>
                <p className="text-sm text-muted-foreground">
                  Trigger an alert when response time exceeds threshold
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="response-time-alerts" />
                <span className="text-sm">500ms</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium">Security Events</h3>
                <p className="text-sm text-muted-foreground">
                  Get alerts for suspicious security events
                </p>
              </div>
              <Switch id="security-alerts" checked={true} />
            </div>
          </div>
          
          <div className="pt-4">
            <Button size="sm">Save Alert Configuration</Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Alert History</span>
            <Button variant="outline" size="sm">
              <BellOff className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <Bell className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>No recent alerts</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
