
import { ClientTaskProgress } from "@/types/client";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { ContentCard } from "@/components/ui/content-card";
import ClientProgressEmpty from "./ClientProgressEmpty";
import ClientProgressLoading from "./ClientProgressLoading";
import ClientProgressList from "./ClientProgressList";
import { useNavigate } from "react-router-dom";

interface ClientProgressSectionProps {
  clientProgress: ClientTaskProgress[] | null;
  isLoading: boolean;
  limit?: number;
  hideViewAll?: boolean;
  title?: string;
}

/**
 * Component for displaying client progress section with proper loading and empty states
 */
export default function ClientProgressSection({
  clientProgress,
  isLoading,
  limit = 3,
  hideViewAll = false,
  title = "Client Progress"
}: ClientProgressSectionProps) {
  const navigate = useNavigate();
  
  const handleClientClick = (linkId: string) => {
    navigate(`/clients/link/${linkId}`);
  };
  
  const renderContent = () => {
    if (isLoading) {
      return <ClientProgressLoading count={limit} />;
    }
    
    if (!clientProgress || clientProgress.length === 0) {
      return (
        <ClientProgressEmpty 
          action={{
            label: "Add Client",
            onClick: () => navigate("/clients")
          }}
        />
      );
    }
    
    return (
      <ClientProgressList 
        clientProgress={clientProgress} 
        limit={limit}
        onClientClick={handleClientClick}
      />
    );
  };
  
  const renderFooter = () => {
    if (hideViewAll || !clientProgress || clientProgress.length === 0) {
      return null;
    }
    
    return (
      <div className="w-full flex justify-end">
        <Button variant="outline" size="sm" asChild>
          <Link to="/clients">
            View All <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    );
  };
  
  return (
    <ContentCard 
      title={title} 
      footer={renderFooter()}
    >
      {renderContent()}
    </ContentCard>
  );
}
