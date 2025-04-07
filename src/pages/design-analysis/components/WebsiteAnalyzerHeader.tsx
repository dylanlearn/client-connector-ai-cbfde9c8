
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface WebsiteAnalyzerHeaderProps {
  isLoggedIn: boolean;
}

export default function WebsiteAnalyzerHeader({ isLoggedIn }: WebsiteAnalyzerHeaderProps) {
  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Website Design Analysis</h1>
      <p className="text-muted-foreground mb-8">
        Analyze website design patterns and store them in the design memory database to enhance AI design recommendations.
      </p>

      {!isLoggedIn && (
        <Alert className="mb-6 border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-700 dark:text-yellow-400">
            You are not logged in. Please sign in to save your analyses to the database.
          </AlertDescription>
        </Alert>
      )}
    </>
  );
}
