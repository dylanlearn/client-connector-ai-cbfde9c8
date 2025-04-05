
import { Card, CardContent } from "@/components/ui/card";
import { Layers, Users, Calendar } from "lucide-react";

interface QuickStatsProps {
  projectCount: number;
}

const QuickStats = ({ projectCount = 0 }: QuickStatsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 col-span-2">
      <Card>
        <CardContent className="p-4 flex items-center space-x-4">
          <div className="bg-primary/10 rounded-full p-2">
            <Layers className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Projects</p>
            <p className="text-2xl font-bold">{projectCount}</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 flex items-center space-x-4">
          <div className="bg-primary/10 rounded-full p-2">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Clients</p>
            <p className="text-2xl font-bold">3</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 flex items-center space-x-4">
          <div className="bg-primary/10 rounded-full p-2">
            <Calendar className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Active Tasks</p>
            <p className="text-2xl font-bold">8</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickStats;
