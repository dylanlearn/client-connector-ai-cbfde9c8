
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell, Calendar, Clock } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

export interface ClientActivity {
  id: string;
  clientName: string;
  clientEmail: string;
  taskType: string;
  taskTitle: string;
  status: 'in_progress' | 'completed';
  timestamp: Date;
}

interface ClientLinkData {
  client_name: string;
  client_email: string;
  designer_id: string;
}

export default function ClientActivityFeed() {
  const { user } = useAuth();
  const [activities, setActivities] = useState<ClientActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!user) return;
    
    // Initial load of recent activities
    const loadRecentActivities = async () => {
      setIsLoading(true);
      try {
        // Join client_tasks with client_access_links to get client info
        const { data, error } = await supabase
          .from('client_tasks')
          .select(`
            id,
            task_type,
            status,
            updated_at,
            completed_at,
            client_access_links!inner(
              client_name,
              client_email
            )
          `)
          .eq('client_access_links.designer_id', user.id)
          .in('status', ['in_progress', 'completed'])
          .order('updated_at', { ascending: false })
          .limit(10);
          
        if (error) throw error;
        
        const formattedActivities: ClientActivity[] = data.map(item => ({
          id: item.id,
          clientName: item.client_access_links?.client_name || 'Unknown Client',
          clientEmail: item.client_access_links?.client_email || 'unknown@example.com',
          taskType: item.task_type,
          taskTitle: getTaskTitle(item.task_type),
          status: item.status as 'in_progress' | 'completed',
          timestamp: new Date(item.status === 'completed' ? item.completed_at : item.updated_at)
        }));
        
        setActivities(formattedActivities);
      } catch (error) {
        console.error("Error loading client activities:", error);
        toast.error("Failed to load client activity feed");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadRecentActivities();
    
    // Set up real-time subscription
    const clientTasksChannel = supabase.channel('client-tasks-changes')
      .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'client_tasks',
            filter: `status=in.["in_progress","completed"]` 
          },
          async (payload) => {
            console.log('Client task updated:', payload);
            
            // Fetch the complete data with the client info
            if (payload.new) {
              try {
                const { data, error } = await supabase
                  .from('client_access_links')
                  .select('client_name, client_email, designer_id')
                  .eq('id', (payload.new as any).link_id)
                  .single();
                  
                if (error) throw error;
                
                // Type-safe handling of data
                const linkData = data as ClientLinkData;
                
                // Only update if this task belongs to the current designer
                if (linkData.designer_id === user.id) {
                  const newActivity: ClientActivity = {
                    id: (payload.new as any).id,
                    clientName: linkData.client_name,
                    clientEmail: linkData.client_email,
                    taskType: (payload.new as any).task_type,
                    taskTitle: getTaskTitle((payload.new as any).task_type),
                    status: (payload.new as any).status as 'in_progress' | 'completed',
                    timestamp: new Date((payload.new as any).updated_at)
                  };
                  
                  // Add to activity feed and maintain order
                  setActivities(prev => {
                    // Remove if already exists (to avoid duplicates)
                    const filtered = prev.filter(a => a.id !== newActivity.id);
                    // Add to beginning and limit to 10
                    return [newActivity, ...filtered].slice(0, 10);
                  });
                  
                  // Show toast notification for completed tasks
                  if (newActivity.status === 'completed') {
                    toast.success(`${newActivity.clientName} completed the ${newActivity.taskTitle}`);
                  }
                }
              } catch (error) {
                console.error('Error processing real-time update:', error);
              }
            }
          })
      .subscribe();
      
    return () => {
      supabase.removeChannel(clientTasksChannel);
    };
  }, [user]);
  
  // Helper function to get friendly task titles
  const getTaskTitle = (taskType: string): string => {
    switch (taskType) {
      case 'intakeForm':
        return 'Project Intake Form';
      case 'designPicker':
        return 'Design Preferences';
      case 'templates':
        return 'Template Selection';
      default:
        return taskType;
    }
  };
  
  // Helper function to get status badge variant
  const getStatusBadgeVariant = (status: 'in_progress' | 'completed') => {
    return status === 'completed' ? 'default' : 'secondary';
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Client Activity</CardTitle>
          <CardDescription>Real-time updates from your clients</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex items-center space-x-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Render empty state
  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Client Activity</CardTitle>
          <CardDescription>Real-time updates from your clients</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-6">
          <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-3 opacity-50" />
          <p className="text-muted-foreground">No recent client activity</p>
          <p className="text-sm text-muted-foreground mt-1">
            Activity will appear here when clients interact with their tasks
          </p>
        </CardContent>
      </Card>
    );
  }
  
  // Render activity feed
  return (
    <Card>
      <CardHeader>
        <CardTitle>Client Activity</CardTitle>
        <CardDescription>Real-time updates from your clients</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
              <div className="rounded-full bg-gray-100 p-2 flex-shrink-0">
                {activity.status === 'completed' ? (
                  <Clock className="h-4 w-4 text-gray-500" />
                ) : (
                  <Calendar className="h-4 w-4 text-gray-500" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium truncate">{activity.clientName}</p>
                  <Badge variant={getStatusBadgeVariant(activity.status)}>
                    {activity.status === 'completed' ? 'Completed' : 'In Progress'}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground mt-1">
                  {activity.status === 'completed' 
                    ? `Completed the ${activity.taskTitle}`
                    : `Started working on ${activity.taskTitle}`
                  }
                </p>
                
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
