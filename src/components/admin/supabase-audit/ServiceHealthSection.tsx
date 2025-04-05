
import React from 'react';
import { Key, Database, HardDrive, FunctionSquare, Check, AlertTriangle, X } from 'lucide-react';
import { SupabaseHealthCheck } from '@/types/supabase-audit';

interface ServiceHealthProps {
  healthCheck: SupabaseHealthCheck;
}

export function ServiceHealthSection({ healthCheck }: ServiceHealthProps) {
  if (!healthCheck) return null;
  
  const getStatusIcon = (status: string) => {
    if (status === 'ok') {
      return <Check className="h-5 w-5 text-green-500" />;
    } else if (status === 'error') {
      return <X className="h-5 w-5 text-red-500" />;
    }
    return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
  };

  const getHealthColor = (status: string) => {
    if (status === 'healthy' || status === 'ok') return 'text-green-600';
    if (status === 'degraded') return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Service Health</h3>
      
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
  );
}
