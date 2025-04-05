
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

// Mock data - typically this would come from an API call
const fetchClientActivity = async () => {
  // Simulate API call
  return [
    { client_name: "Acme Corp", client_email: "contact@acmecorp.com", action: "viewed proposal", timestamp: "2023-04-01T14:53:00Z" },
    { client_name: "Stark Industries", client_email: "tony@stark.com", action: "provided feedback", timestamp: "2023-03-29T09:15:00Z" },
    { client_name: "Wayne Enterprises", client_email: "bruce@wayne.com", action: "approved design", timestamp: "2023-03-25T16:40:00Z" },
  ];
};

const ClientActivityFeed = () => {
  const [activities, setActivities] = useState<Array<{
    client_name: string;
    client_email: string;
    action: string;
    timestamp: string;
  }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadActivities = async () => {
      try {
        setIsLoading(true);
        const data = await fetchClientActivity();
        setActivities(data);
      } catch (error) {
        console.error("Error fetching client activity:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load client activity feed"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadActivities();
  }, [toast]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="text-xl">Client Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={index} className="border-b pb-3 last:border-0">
                <div className="font-medium">{activity.client_name}</div>
                <div className="text-sm text-gray-500">{activity.client_email}</div>
                <div className="mt-1 flex justify-between">
                  <span className="text-sm">{activity.action}</span>
                  <span className="text-xs text-gray-400">{formatDate(activity.timestamp)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientActivityFeed;
