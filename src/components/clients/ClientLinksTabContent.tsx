
import { ClientAccessLink } from "@/types/client";
import PaginatedClientLinks from "./PaginatedClientLinks";

interface ClientLinksTabContentProps {
  links: ClientAccessLink[];
  isLoading: boolean;
  status: 'active' | 'completed' | 'expired';
  onRefresh: () => void;
}

export default function ClientLinksTabContent({ 
  links, 
  isLoading, 
  status,
  onRefresh 
}: ClientLinksTabContentProps) {
  // Filter links based on status
  const filteredLinks = links.filter(link => 
    link.status === status
  );
  
  return (
    <PaginatedClientLinks 
      links={filteredLinks} 
      isLoading={isLoading}
      onRefresh={onRefresh}
    />
  );
}
