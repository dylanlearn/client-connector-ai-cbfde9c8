
import { LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface TrendsTabProps {
  hasProData: boolean;
}

const TrendsTab = ({ hasProData }: TrendsTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Design Preference Trends</CardTitle>
        <CardDescription>
          How selections have changed over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        {hasProData ? (
          <div className="min-h-[400px] flex items-center justify-center">
            <p className="text-muted-foreground">Trend data visualization...</p>
          </div>
        ) : (
          <div className="min-h-[400px] flex flex-col items-center justify-center bg-muted/30 rounded-md p-6">
            <LayoutGrid className="h-10 w-10 text-muted-foreground mb-4" />
            <h3 className="font-medium text-lg mb-2">Pro Feature</h3>
            <p className="text-muted-foreground text-center max-w-md mb-4">
              Upgrade to Pro to access trend analysis showing how design 
              preferences evolve over time across different projects.
            </p>
            <Button>Upgrade to Pro</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TrendsTab;
