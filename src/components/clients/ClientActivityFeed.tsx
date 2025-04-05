
import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface ClientActivity {
  id: string;
  clientName: string;
  clientEmail: string;
  action: string;
  timestamp: string;
  status?: string;
}

const ClientActivityFeed = () => {
  const [activities, setActivities] = useState<ClientActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const loadActivities = async () => {
      setIsLoading(true);
      try {
        // Mock data - in a real app this would come from an API
        setTimeout(() => {
          setActivities([
            {
              id: '1',
              clientName: 'Jane Smith',
              clientEmail: 'jane.smith@example.com',
              action: 'Completed intake form',
              timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
              status: 'completed'
            },
            {
              id: '2',
              clientName: 'Robert Johnson',
              clientEmail: 'robert@example.com',
              action: 'Viewed design options',
              timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
              status: 'in-progress'
            },
            {
              id: '3',
              clientName: 'Sarah Miller',
              clientEmail: 'sarah@example.com',
              action: 'Added feedback on wireframe',
              timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
              status: 'feedback'
            }
          ]);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error loading activities", error);
        setIsLoading(false);
      }
    };
    
    loadActivities();
  }, []);
  
  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now.getTime() - past.getTime();
    
    const diffMinutes = Math.floor(diffMs / (60 * 1000));
    const diffHours = Math.floor(diffMs / (60 * 60 * 1000));
    const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
    
    if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return `${diffDays}d ago`;
    }
  };
  
  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Completed</Badge>;
      case 'in-progress':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case 'feedback':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800">Feedback</Badge>;
      default:
        return null;
    }
  };

  return (
    <ScrollArea className="h-[350px]">
      <div className="space-y-5 pr-3">
        {isLoading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
          ))
        ) : activities.length > 0 ? (
          activities.map(activity => (
            <div key={activity.id} className="flex gap-3">
              <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="font-medium">
                  {activity.clientName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <p className="font-medium">{activity.clientName}</p>
                  <span className="text-xs text-muted-foreground">
                    {formatTimeAgo(activity.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{activity.action}</p>
                <div className="mt-1">
                  {getStatusBadge(activity.status)}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-10 text-center">
            <p className="text-muted-foreground">No recent activity</p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default ClientActivityFeed;
