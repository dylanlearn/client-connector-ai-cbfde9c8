
import React, { useState, useEffect } from 'react';
import { BackupSchedule, BackupFrequency } from '@/types/enterprise-storage';
import { EnterpriseStorageService } from '@/services/enterprise/EnterpriseStorageService';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CalendarClock, Loader2, Plus, Trash } from 'lucide-react';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface BackupSchedulesProps {
  integrationId: string;
}

export const BackupSchedules: React.FC<BackupSchedulesProps> = ({ integrationId }) => {
  const [schedules, setSchedules] = useState<BackupSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    frequency: 'daily' as BackupFrequency,
    retention_days: 30
  });

  const loadSchedules = async () => {
    if (!integrationId) return;
    
    setIsLoading(true);
    try {
      const data = await EnterpriseStorageService.getBackupSchedules(integrationId);
      setSchedules(data);
    } catch (error) {
      console.error('Error loading backup schedules:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSchedules();
  }, [integrationId]);

  const handleCreateSchedule = async () => {
    setIsCreating(true);
    try {
      const schedule = await EnterpriseStorageService.createBackupSchedule(
        integrationId,
        formData.name,
        formData.frequency,
        formData.retention_days
      );
      
      if (schedule) {
        setSchedules([...schedules, schedule]);
        setShowAddDialog(false);
        toast.success('Backup schedule created successfully');
        resetForm();
      }
    } catch (error) {
      console.error('Error creating backup schedule:', error);
      toast.error('Failed to create backup schedule');
    } finally {
      setIsCreating(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      frequency: 'daily',
      retention_days: 30
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button variant="outline" size="sm" onClick={loadSchedules} disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh"}
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setShowAddDialog(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Schedule
        </Button>
      </div>
      
      <div className="space-y-2">
        {isLoading ? (
          Array.from({ length: 2 }).map((_, index) => (
            <Card key={index}>
              <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-5 w-20" />
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="grid grid-cols-2 gap-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : schedules.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <CalendarClock className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No backup schedules configured</p>
              <Button 
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => setShowAddDialog(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Schedule
              </Button>
            </CardContent>
          </Card>
        ) : (
          schedules.map((schedule) => (
            <Card key={schedule.id}>
              <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
                <h5 className="font-medium text-base">{schedule.name}</h5>
                <Badge variant={schedule.is_active ? 'outline' : 'secondary'}>
                  {schedule.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Frequency</p>
                    <p className="capitalize">{schedule.frequency}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Retention</p>
                    <p>{schedule.retention_days} days</p>
                  </div>
                  {schedule.next_backup_at && (
                    <div>
                      <p className="text-sm text-muted-foreground">Next Backup</p>
                      <p>{format(new Date(schedule.next_backup_at), 'MMM d, yyyy HH:mm')}</p>
                    </div>
                  )}
                  {schedule.last_backup_at && (
                    <div>
                      <p className="text-sm text-muted-foreground">Last Backup</p>
                      <p>{format(new Date(schedule.last_backup_at), 'MMM d, yyyy HH:mm')}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Backup Schedule</DialogTitle>
            <DialogDescription>
              Set up an automatic backup schedule for this storage integration
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Schedule Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Daily Backup"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="frequency">Frequency</Label>
              <Select
                value={formData.frequency}
                onValueChange={(value) => setFormData({ ...formData, frequency: value as BackupFrequency })}
              >
                <SelectTrigger id="frequency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="retention">Retention Period (days)</Label>
              <Input
                id="retention"
                type="number"
                min="1"
                max="365"
                value={formData.retention_days}
                onChange={(e) => setFormData({ ...formData, retention_days: parseInt(e.target.value) })}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowAddDialog(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateSchedule} disabled={isCreating}>
              {isCreating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                'Create Schedule'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
