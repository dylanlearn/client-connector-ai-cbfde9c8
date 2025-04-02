
import { Progress } from "@/components/ui/progress";

interface ClientProgressItemProps {
  clientName: string;
  completed: number;
  total: number;
}

export default function ClientProgressItem({ clientName, completed, total }: ClientProgressItemProps) {
  const progressPercentage = total > 0 ? (completed / total) * 100 : 0;
  
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="font-medium">{clientName}</span>
        <span className="text-muted-foreground">
          {completed}/{total} tasks
        </span>
      </div>
      <Progress
        value={progressPercentage}
        className="h-2"
      />
    </div>
  );
}
