
import { ClientAccessLink } from "@/types/client";
import ClientLinksList from "./ClientLinksList";

interface ClientLinksTabContentProps {
  links: ClientAccessLink[];
  isLoading: boolean;
  status: 'active' | 'expired';
  onRefresh: () => void;
}

export default function ClientLinksTabContent({ 
  links, 
  isLoading, 
  status,
  onRefresh 
}: ClientLinksTabContentProps) {
  const filteredLinks = links.filter(link => 
    status === 'active' ? link.status === 'active' : link.status !== 'active'
  );
  
  return (
    <ClientLinksList 
      links={filteredLinks} 
      isLoading={isLoading}
      onRefresh={onRefresh}
    />
  );
}
