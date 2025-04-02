
import { useState } from "react";
import { UserPlus, Loader2, Download, RefreshCw } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ClientsTable from "@/components/clients/ClientsTable";
import ClientAddDialog from "@/components/clients/ClientAddDialog";
import { useClientLinks } from "@/hooks/use-client-links";

const ClientsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { clientLinks, isLoading, loadClientLinks } = useClientLinks();

  // Transform client links into a more convenient format for our table
  // Using camelCase property names as defined in the ClientAccessLink interface
  const clients = clientLinks.map(link => ({
    id: link.id,
    name: link.clientName,
    email: link.clientEmail,
    phone: link.clientPhone || 'N/A',
    industry: 'Design', // This is a placeholder, as industry isn't currently stored
    projects: 1, // This is a placeholder, as we're counting 1 project per client link
    revenue: '$0.00', // This is a placeholder, as revenue isn't currently stored
    status: link.status
  }));

  // Filter clients based on search term
  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.industry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 md:mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Clients</h1>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={loadClientLinks} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          
          <Button size="sm" onClick={() => setIsDialogOpen(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Client
          </Button>
        </div>
      </div>
      
      <div className="mb-6">
        <Input
          placeholder="Search clients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <ClientsTable clients={filteredClients} />
      )}
      
      <ClientAddDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </DashboardLayout>
  );
};

export default ClientsPage;
