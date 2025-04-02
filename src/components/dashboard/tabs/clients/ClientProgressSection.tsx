
import { Button } from "@/components/ui/button";
import { PlusCircle, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
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
}

export default function ClientProgressSection({ clientProgress, isLoading }: ClientProgressSectionProps) {
  const navigate = useNavigate();
  
  const handleCreateClientClick = () => {
    navigate('/clients');
  };
  
  return (
    <Card>
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
        ) : clientProgress && clientProgress.length > 0 ? (
          <div className="space-y-5">
            {clientProgress.map((client, index) => (
              <ClientProgressItem
                key={index}
                clientName={client.clientName}
                completed={client.completed}
                total={client.total}
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
    </Card>
  );
}
