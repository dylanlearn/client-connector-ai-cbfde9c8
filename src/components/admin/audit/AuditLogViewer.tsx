
import React, { useState, useEffect } from 'react';
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { 
  Clock, 
  FileText, 
  RefreshCw, 
  Search, 
  Trash2, 
  User, 
  Filter, 
  Loader2 
} from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

type AuditLog = {
  id: string;
  user_id: string | null;
  action: string;
  resource_type: string;
  resource_id: string | null;
  metadata: Record<string, any>;
  ip_address: string | null;
  created_at: string;
  user_email?: string;
}

export function AuditLogViewer() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState({
    action: '',
    resourceType: '',
    userId: '',
    search: ''
  });
  const [actionTypes, setActionTypes] = useState<string[]>([]);
  const [resourceTypes, setResourceTypes] = useState<string[]>([]);
  const { toast } = useToast();

  const loadAuditLogs = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('audit_logs')
        .select(`
          *,
          profiles:user_id (
            email
          )
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (filter.action) {
        query = query.eq('action', filter.action);
      }
      
      if (filter.resourceType) {
        query = query.eq('resource_type', filter.resourceType);
      }

      if (filter.userId) {
        query = query.eq('user_id', filter.userId);
      }

      if (filter.search) {
        query = query.or(`resource_id.ilike.%${filter.search}%,metadata.ilike.%${filter.search}%`);
      }

      const { data, error } = await query;
      
      if (error) {
        throw error;
      }

      // Transform data to include user email
      const transformedData = data.map(log => ({
        ...log,
        user_email: log.profiles?.email || 'Unknown'
      }));
      
      setLogs(transformedData);
      
      // Get unique action types and resource types for filters
      if (!filter.action && !filter.resourceType) {
        const actions = [...new Set(transformedData.map(log => log.action))];
        const resources = [...new Set(transformedData.map(log => log.resource_type))];
        
        setActionTypes(actions);
        setResourceTypes(resources);
      }
    } catch (error: any) {
      console.error("Error loading audit logs:", error);
      toast({
        title: "Error loading audit logs",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAuditLogs();
  }, [filter.action, filter.resourceType, filter.userId]);
  
  const getActionBadgeColor = (action: string) => {
    switch (action.toLowerCase()) {
      case 'create':
        return 'bg-green-500';
      case 'update':
        return 'bg-blue-500';
      case 'delete':
        return 'bg-red-500';
      case 'read':
        return 'bg-gray-500';
      default:
        return 'bg-purple-500';
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadAuditLogs();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-end">
        <div className="flex flex-wrap gap-2">
          <div className="w-40">
            <label className="text-sm font-medium mb-1 block">Action</label>
            <Select 
              value={filter.action} 
              onValueChange={(value) => setFilter({...filter, action: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="All actions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All actions</SelectItem>
                {actionTypes.map(action => (
                  <SelectItem key={action} value={action}>{action}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-40">
            <label className="text-sm font-medium mb-1 block">Resource Type</label>
            <Select 
              value={filter.resourceType} 
              onValueChange={(value) => setFilter({...filter, resourceType: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="All resources" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All resources</SelectItem>
                {resourceTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <form onSubmit={handleSearch} className="flex items-end gap-2">
            <div>
              <label className="text-sm font-medium mb-1 block">Search</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Resource ID or metadata" 
                  className="pl-8" 
                  value={filter.search}
                  onChange={(e) => setFilter({...filter, search: e.target.value})}
                />
              </div>
            </div>
            <Button type="submit" variant="secondary" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </form>
        </div>
        
        <Button 
          onClick={loadAuditLogs}
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          <span>Refresh</span>
        </Button>
      </div>
      
      <Card className="border">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Resource Type</TableHead>
                  <TableHead>Resource ID</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No audit logs found.
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1 text-gray-400" />
                          <span title={new Date(log.created_at).toLocaleString()}>
                            {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="truncate max-w-[180px]">{log.user_email || 'Unknown'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getActionBadgeColor(log.action)}>
                          {log.action}
                        </Badge>
                      </TableCell>
                      <TableCell>{log.resource_type}</TableCell>
                      <TableCell className="font-mono text-xs max-w-[100px] truncate" title={log.resource_id || ''}>
                        {log.resource_id || '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-8 w-8 p-0" 
                            title="View details"
                            onClick={() => {
                              toast({
                                title: "Log Details",
                                description: (
                                  <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4 overflow-x-auto">
                                    <code className="text-white text-xs">
                                      {JSON.stringify(log.metadata, null, 2)}
                                    </code>
                                  </pre>
                                ),
                              });
                            }}
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
