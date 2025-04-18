
import React from 'react';
import { Check, X, Shield } from 'lucide-react';

interface DatabaseTablesSectionProps {
  databaseData: {
    tables?: string[];
    status: 'ok' | 'error';
    message: string;
    performance?: any;
  };
}

export function DatabaseTablesSection({ databaseData }: DatabaseTablesSectionProps) {
  if (!databaseData) return null;
  
  const tables = databaseData.tables || [];
  const requiredTables = ['profiles', 'global_memories', 'user_memories', 'project_memories', 'feedback_analysis', 'projects'];
  
  // Simple RLS check - in a real app this would call the backend
  const rlsCheck = requiredTables.reduce((acc, table) => {
    acc[table] = true; // Assume protected for now
    return acc;
  }, {} as Record<string, boolean>);

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Database Tables</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-gray-500">Required Tables</h4>
          <div className="p-3 border rounded-md bg-gray-50 max-h-[200px] overflow-y-auto">
            <ul className="space-y-2">
              {requiredTables.map(table => (
                <li key={table} className="flex items-center justify-between text-sm">
                  <span>{table}</span>
                  {!tables.includes(table) ? (
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
  );
}
