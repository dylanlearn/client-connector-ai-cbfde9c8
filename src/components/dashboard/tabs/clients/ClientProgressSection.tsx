
import { Button } from "@/components/ui/button";
import { PlusCircle, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ClientProgressItem from "./ClientProgressItem";

interface ClientProgressItem {
  clientName: string;
  email: string;
  completed: number;
  total: number;
  lastActive: Date | null;
}

interface ClientProgressSectionProps {
  clientProgress: ClientProgressItem[] | undefined;
  isLoading: boolean;
  limit?: number;
}

export default function ClientProgressSection({ 
  clientProgress, 
  isLoading,
  limit = 5
}: ClientProgressSectionProps) {
  const navigate = useNavigate();
  
  const handleCreateClientClick = () => {
    navigate('/clients');
  };

  const handleSeeAllClick = () => {
    navigate('/clients');
  };
  
  // Limit the number of clients shown to the specified limit
  const limitedProgress = clientProgress?.slice(0, limit);
  const hasMoreClients = clientProgress && clientProgress.length > limit;
  
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Client Progress</CardTitle>
          <CardDescription>Task completion by client</CardDescription>
        </div>
        <Button size="sm" onClick={handleCreateClientClick}>
          <PlusCircle className="h-4 w-4 mr-2" />
          New Client
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-2 w-full" />
              </div>
            ))}
          </div>
        ) : limitedProgress && limitedProgress.length > 0 ? (
          <div className="space-y-4">
            {limitedProgress.map((client, index) => (
              <ClientProgressItem
                key={index}
                clientName={client.clientName}
                email={client.email}
                completed={client.completed}
                total={client.total}
                lastActive={client.lastActive}
                onClick={() => navigate(`/clients?client=${client.email}`)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-3 opacity-50" />
            <p className="text-muted-foreground">No active clients</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4"
              onClick={handleCreateClientClick}
            >
              Add Your First Client
            </Button>
          </div>
        )}
      </CardContent>
      {hasMoreClients && (
        <CardFooter className="pt-0">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full" 
            onClick={handleSeeAllClick}
          >
            See all clients
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
