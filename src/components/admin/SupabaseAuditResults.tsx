
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Check, 
  AlertTriangle, 
  X, 
  Database, 
  Shield, 
  Key, 
  HardDrive,
  FunctionSquare,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SupabaseAuditResultsProps {
  healthCheck: any;
  tablesCheck: {
    missingTables: string[];
    existingTables: string[];
  } | null;
  rlsCheck: Record<string, boolean> | null;
  cacheCleanup: number;
  onRefresh: () => void;
  isLoading: boolean;
}

export function SupabaseAuditResults({
  healthCheck,
  tablesCheck,
  rlsCheck,
  cacheCleanup,
  onRefresh,
  isLoading
}: SupabaseAuditResultsProps) {
  const getStatusIcon = (status: 'ok' | 'error' | boolean) => {
    if (status === 'ok' || status === true) {
      return <Check className="h-5 w-5 text-green-500" />;
    } else if (status === 'error' || status === false) {
      return <X className="h-5 w-5 text-red-500" />;
    }
    return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
  };
  
  const getHealthColor = (status: string) => {
    if (status === 'healthy' || status === 'ok') return 'text-green-600';
    if (status === 'degraded') return 'text-yellow-600';
    return 'text-red-600';
  };
  
  if (!healthCheck) return null;
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Supabase Audit Results</CardTitle>
            <CardDescription>
              Comprehensive audit of your Supabase configuration
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRefresh} 
            disabled={isLoading}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Run Audit Again
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-2">Service Health</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
              <div className="flex items-center">
                <Key className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm">Authentication</span>
              </div>
              <div className="flex items-center">
                {getStatusIcon(healthCheck.auth.status)}
                <span className={`ml-2 text-xs ${getHealthColor(healthCheck.auth.status)}`}>
                  {healthCheck.auth.status.toUpperCase()}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
              <div className="flex items-center">
                <Database className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm">Database</span>
              </div>
              <div className="flex items-center">
                {getStatusIcon(healthCheck.database.status)}
                <span className={`ml-2 text-xs ${getHealthColor(healthCheck.database.status)}`}>
                  {healthCheck.database.status.toUpperCase()}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
              <div className="flex items-center">
                <HardDrive className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm">Storage</span>
              </div>
              <div className="flex items-center">
                {getStatusIcon(healthCheck.storage.status)}
                <span className={`ml-2 text-xs ${getHealthColor(healthCheck.storage.status)}`}>
                  {healthCheck.storage.status.toUpperCase()}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
              <div className="flex items-center">
                <FunctionSquare className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm">Edge Functions</span>
              </div>
              <div className="flex items-center">
                {getStatusIcon(healthCheck.functions.status)}
                <span className={`ml-2 text-xs ${getHealthColor(healthCheck.functions.status)}`}>
                  {healthCheck.functions.status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Edge Functions Section */}
        <div>
          <h3 className="text-sm font-medium mb-2">Edge Functions</h3>
          <div className="p-3 border rounded-md bg-gray-50 h-[160px] overflow-y-auto">
            {healthCheck.functions.availableFunctions && healthCheck.functions.availableFunctions.length > 0 ? (
              <ul className="space-y-2">
                {healthCheck.functions.availableFunctions.map((fn: string) => (
                  <li key={fn} className="flex items-center text-sm">
                    <FunctionSquare className="h-3 w-3 mr-2 text-blue-500" />
                    {fn}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No edge functions detected</p>
            )}
          </div>
        </div>
        
        {/* Database Tables Section */}
        {tablesCheck && (
          <div>
            <h3 className="text-sm font-medium mb-2">Database Tables</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-gray-500">Required Tables</h4>
                <div className="p-3 border rounded-md bg-gray-50 max-h-[200px] overflow-y-auto">
                  <ul className="space-y-2">
                    {['profiles', 'global_memories', 'user_memories', 'project_memories', 'feedback_analysis', 'projects', 'ai_wireframes', 'wireframe_sections', 'wireframe_versions'].map(table => (
                      <li key={table} className="flex items-center justify-between text-sm">
                        <span>{table}</span>
                        {tablesCheck.missingTables.includes(table) ? (
                          <X className="h-4 w-4 text-red-500" />
                        ) : (
                          <Check className="h-4 w-4 text-green-500" />
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-gray-500">RLS Policies</h4>
                <div className="p-3 border rounded-md bg-gray-50 max-h-[200px] overflow-y-auto">
                  {rlsCheck ? (
                    <ul className="space-y-2">
                      {Object.entries(rlsCheck).map(([table, hasRLS]) => (
                        <li key={table} className="flex items-center justify-between text-sm">
                          <div className="flex items-center">
                            <Shield className="h-3 w-3 mr-2 text-gray-500" />
                            {table}
                          </div>
                          {hasRLS ? (
                            <span className="text-xs text-green-600">Protected</span>
                          ) : (
                            <span className="text-xs text-red-600">Unprotected</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">RLS policy information not available</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Cache Cleanup */}
        <div className="p-3 border rounded-md bg-gray-50">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Cache entries cleaned:</span>
            <Badge variant="outline">{cacheCleanup}</Badge>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="bg-gray-50 border-t">
        <div className="flex w-full justify-between items-center">
          <div className="text-sm text-gray-600">
            Last checked: {new Date().toLocaleTimeString()}
          </div>
          
          <div className={`font-medium ${getHealthColor(healthCheck.overall)}`}>
            Overall: {healthCheck.overall.toUpperCase()}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
