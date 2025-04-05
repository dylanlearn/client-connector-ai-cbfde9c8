
import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Mail, Phone, Info, Download, Edit, UserPlus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  industry: string;
  projects: number;
  revenue: string;
  status: string;
}

interface ClientsTableProps {
  clients: Client[];
}

const ClientsTable = ({ clients }: ClientsTableProps) => {
  const isMobile = useIsMobile();
  
  const statusColors = {
    active: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    completed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    expired: "bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-400"
  };

  return (
    <div className="rounded-lg border shadow-sm overflow-hidden bg-white dark:bg-card">
      <ScrollArea className="h-[calc(100vh-250px)]">
        <div className="table-responsive">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead className={isMobile ? "hidden md:table-cell" : ""}>Contact</TableHead>
                <TableHead className="hidden lg:table-cell">Industry</TableHead>
                <TableHead className={`${isMobile ? "hidden sm:table-cell" : ""} text-center`}>Projects</TableHead>
                <TableHead className={`${isMobile ? "hidden md:table-cell" : ""} text-right`}>Revenue</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center py-8">
                      <Info className="h-10 w-10 text-muted-foreground/40 mb-2" />
                      <p className="text-muted-foreground">No clients found</p>
                      <Button size="sm" variant="outline" className="mt-4">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add Client
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                clients.map((client) => (
                  <TableRow key={client.id} className="hover:bg-muted/40">
                    <TableCell className="font-medium">
                      <div className="max-w-[200px] truncate">{client.name}</div>
                    </TableCell>
                    
                    <TableCell className={isMobile ? "hidden md:table-cell" : ""}>
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="h-3 w-3 mr-1.5 text-muted-foreground" />
                          <span className="truncate max-w-[150px]">{client.email}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone className="h-3 w-3 mr-1.5 text-muted-foreground" />
                          <span>{client.phone}</span>
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell className="hidden lg:table-cell">{client.industry}</TableCell>
                    
                    <TableCell className={`${isMobile ? "hidden sm:table-cell" : ""} text-center`}>
                      <Badge variant="outline" className="bg-primary/5">
                        {client.projects}
                      </Badge>
                    </TableCell>
                    
                    <TableCell className={`${isMobile ? "hidden md:table-cell" : ""} text-right font-medium`}>
                      {client.revenue}
                    </TableCell>
                    
                    <TableCell className="text-center">
                      <Badge className={`${statusColors[client.status as keyof typeof statusColors] || "bg-gray-200"}`}>
                        {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem className="flex items-center">
                            <Info className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Client
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="flex items-center">
                            <UserPlus className="mr-2 h-4 w-4" />
                            Create Project
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center">
                            <Download className="mr-2 h-4 w-4" />
                            Export Data
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </ScrollArea>
    </div>
  );
};

export default ClientsTable;
