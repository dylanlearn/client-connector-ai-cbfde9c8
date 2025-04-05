
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle2, 
  AlertCircle, 
  XCircle,
  Key, 
  Database, 
  HardDrive, 
  FunctionSquare 
} from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { SupabaseHealthCheck } from '@/types/supabase-audit';

interface ServiceHealthProps {
  healthCheck: SupabaseHealthCheck;
}

export function ServiceHealthSection({ healthCheck }: ServiceHealthProps) {
  if (!healthCheck) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ok':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ok':
        return 'bg-green-50 border-green-200 text-green-700';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-700';
      default:
        return 'bg-yellow-50 border-yellow-200 text-yellow-700';
    }
  };

  const getOverallBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return <Badge className="bg-green-500">Healthy</Badge>;
      case 'degraded':
        return <Badge className="bg-yellow-500">Degraded</Badge>;
      case 'unhealthy':
        return <Badge className="bg-red-500">Unhealthy</Badge>;
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>;
    }
  };

  const services = [
    { 
      name: 'Authentication',
      status: healthCheck.auth.status,
      message: healthCheck.auth.message,
      icon: <Key className="h-5 w-5 text-blue-500" />
    },
    { 
      name: 'Database',
      status: healthCheck.database.status,
      message: healthCheck.database.message,
      icon: <Database className="h-5 w-5 text-purple-500" />
    },
    { 
      name: 'Storage',
      status: healthCheck.storage.status,
      message: healthCheck.storage.message,
      icon: <HardDrive className="h-5 w-5 text-green-500" />
    },
    { 
      name: 'Edge Functions',
      status: healthCheck.functions.status,
      message: healthCheck.functions.message,
      icon: <FunctionSquare className="h-5 w-5 text-orange-500" />
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Service Health</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Overall:</span>
          {getOverallBadge(healthCheck.overall)}
        </div>
      </div>

      <Alert className={`${getStatusColor(healthCheck.overall === 'healthy' ? 'ok' : 'error')}`}>
        <div className="flex items-center">
          {getStatusIcon(healthCheck.overall === 'healthy' ? 'ok' : healthCheck.overall === 'degraded' ? 'degraded' : 'error')}
          <div className="ml-2">
            <AlertTitle>
              {healthCheck.overall === 'healthy' 
                ? 'All systems operational' 
                : healthCheck.overall === 'degraded'
                  ? 'Some systems degraded'
                  : 'System issues detected'}
            </AlertTitle>
            <AlertDescription>
              {healthCheck.overall === 'healthy' 
                ? 'All Supabase services are operating normally.'
                : 'Some Supabase services require attention.'}
            </AlertDescription>
          </div>
        </div>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {services.map((service) => (
          <div 
            key={service.name} 
            className={`p-4 rounded-md border ${getStatusColor(service.status)}`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                {service.icon}
                <h4 className="font-medium">{service.name}</h4>
              </div>
              {getStatusIcon(service.status)}
            </div>
            <p className="text-sm">{service.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
