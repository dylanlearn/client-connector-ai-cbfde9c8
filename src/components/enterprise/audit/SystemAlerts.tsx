
import React, { useState, useEffect } from 'react';
import { SystemAlert } from '@/types/audit-trail';
import { AuditTrailService } from '@/services/enterprise/AuditTrailService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Bell, Check, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';

export const SystemAlerts: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'resolved'>('active');
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<SystemAlert | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [isResolving, setIsResolving] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const loadAlerts = async () => {
    setIsLoading(true);
    try {
      const data = await AuditTrailService.getSystemAlerts(
        activeTab === 'active' ? false : true
      );
      setAlerts(data);
    } catch (error) {
      console.error('Error loading system alerts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, [activeTab]);

  const handleResolveAlert = async () => {
    if (!selectedAlert) return;
    
    setIsResolving(true);
    try {
      const success = await AuditTrailService.resolveAlert(selectedAlert.id, resolutionNotes);
      if (success) {
        loadAlerts();
        setShowDialog(false);
        setSelectedAlert(null);
        setResolutionNotes('');
      }
    } catch (error) {
      console.error('Error resolving alert:', error);
    } finally {
      setIsResolving(false);
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      case 'high':
        return <Badge className="bg-orange-500">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-500">Medium</Badge>;
      case 'low':
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge variant="secondary">{severity}</Badge>;
    }
  };

  const renderAlertCards = () => {
    if (isLoading) {
      return Array.from({ length: 3 }).map((_, index) => (
        <Card key={index}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-6 w-20" />
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-4 w-24" />
          </CardFooter>
        </Card>
      ));
    }

    if (alerts.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          {activeTab === 'active' ? (
            <>
              <Bell className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No active alerts</h3>
              <p className="text-muted-foreground">
                All system alerts have been resolved
              </p>
            </>
          ) : (
            <>
              <Check className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No resolved alerts</h3>
              <p className="text-muted-foreground">
                There are no resolved alerts in the system
              </p>
            </>
          )}
        </div>
      );
    }

    return alerts.map((alert) => (
      <Card key={alert.id}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">{alert.message}</CardTitle>
            <div>{getSeverityBadge(alert.severity)}</div>
          </div>
          <CardDescription>{alert.component}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center text-sm">
            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
            {formatDistanceToNow(new Date(alert.created_at), { addSuffix: true })}
          </div>
        </CardContent>
        <CardFooter>
          {activeTab === 'active' ? (
            <Button 
              variant="outline" 
              onClick={() => {
                setSelectedAlert(alert);
                setShowDialog(true);
              }}
            >
              Resolve Alert
            </Button>
          ) : (
            <div className="text-sm text-muted-foreground">
              Resolved {alert.resolved_at ? formatDistanceToNow(new Date(alert.resolved_at), { addSuffix: true }) : ''}
            </div>
          )}
        </CardFooter>
      </Card>
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">System Alerts</h2>
        <Button variant="outline" size="sm" onClick={loadAlerts}>
          Refresh Alerts
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as 'active' | 'resolved')}>
        <TabsList>
          <TabsTrigger value="active" className="flex items-center">
            <AlertCircle className="mr-2 h-4 w-4" />
            Active
          </TabsTrigger>
          <TabsTrigger value="resolved" className="flex items-center">
            <Check className="mr-2 h-4 w-4" />
            Resolved
          </TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          <TabsContent value="active" className="m-0">
            <div className="grid gap-4">
              {renderAlertCards()}
            </div>
          </TabsContent>
          
          <TabsContent value="resolved" className="m-0">
            <div className="grid gap-4">
              {renderAlertCards()}
            </div>
          </TabsContent>
        </div>
      </Tabs>
      
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resolve Alert</DialogTitle>
            <DialogDescription>
              Add resolution notes to document how this issue was addressed
            </DialogDescription>
          </DialogHeader>
          
          {selectedAlert && (
            <div className="space-y-4 py-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Alert:</span>
                  {selectedAlert.message}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-semibold">Component:</span>
                  {selectedAlert.component}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-semibold">Severity:</span>
                  {getSeverityBadge(selectedAlert.severity)}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="resolution-notes">Resolution Notes</Label>
                <Textarea
                  id="resolution-notes"
                  placeholder="Describe how this alert was resolved..."
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleResolveAlert}
              disabled={isResolving}
            >
              {isResolving ? 'Resolving...' : 'Resolve Alert'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
