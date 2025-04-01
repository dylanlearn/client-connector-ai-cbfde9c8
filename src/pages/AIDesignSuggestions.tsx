
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DesignSuggestions from "@/components/ai/DesignSuggestions";
import { useAuth } from "@/contexts/AuthContext";

const AIDesignSuggestions = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">AI Design Assistant</h1>
        <p className="text-muted-foreground mb-8 max-w-3xl">
          Our AI assistant can help you with design ideas, color schemes, layout suggestions, and more.
          Just describe what you're looking for, and we'll generate tailored recommendations for your project.
        </p>
        <DesignSuggestions />
      </main>
    </div>
  );
};

export default AIDesignSuggestions;
