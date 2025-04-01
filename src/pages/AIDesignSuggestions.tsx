
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DesignSuggestions from "@/components/ai/DesignSuggestions";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";

const AIDesignSuggestions = () => {
  const { user, isLoading, profile } = useAuth();
  const navigate = useNavigate();
  const [pageLoaded, setPageLoaded] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    } else if (user && profile) {
      setPageLoaded(true);
    }
  }, [user, isLoading, navigate, profile]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <main className="container mx-auto py-8 px-4">
          <Skeleton className="h-12 w-64 mb-6" />
          <Skeleton className="h-5 w-full max-w-3xl mb-2" />
          <Skeleton className="h-5 w-full max-w-2xl mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-80 w-full" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">AI Design Assistant</h1>
        <p className="text-muted-foreground mb-8 max-w-3xl">
          Our AI assistant can help you with design ideas, color schemes, layout suggestions, and more.
          Just describe what you're looking for, and we'll generate tailored recommendations for your project.
          {profile && profile.name && ` Personalized for ${profile.name}.`}
        </p>
        <DesignSuggestions />
      </main>
    </div>
  );
};

export default AIDesignSuggestions;
