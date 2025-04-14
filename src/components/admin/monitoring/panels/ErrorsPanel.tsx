
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { ClientError } from '@/utils/monitoring/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, AlertTriangle, X, RefreshCw } from 'lucide-react';

export function ErrorsPanel() {
  const [errors, setErrors] = useState<ClientError[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchErrors = async () => {
    setIsLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('client_errors')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(10);
        
      if (fetchError) throw fetchError;
      
      setErrors(data || []);
    } catch (err) {
      console.error('Error fetching client errors:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch errors'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchErrors();
  }, []);

  const resolveError = async (id: string) => {
    try {
      const { error: updateError } = await supabase
        .from('client_errors')
        .update({ 
          resolved: true,
          resolved_at: new Date().toISOString(),
        })
        .eq('id', id);
        
      if (updateError) throw updateError;
      
      // Update local state
      setErrors(errors.map(err => 
        err.id === id ? { ...err, resolved: true, resolved_at: new Date().toISOString() } : err
      ));
    } catch (err) {
      console.error('Error resolving error:', err);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Client-Side Errors</CardTitle>
        <Button variant="outline" onClick={fetchErrors} size="sm">
          <RefreshCw className="h-4 w-4 mr-1" /> Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-8 text-center">
            <div className="animate-spin h-6 w-6 border-b-2 border-primary mx-auto mb-2 rounded-full"></div>
            <p className="text-muted-foreground">Loading errors...</p>
          </div>
        ) : error ? (
          <div className="py-8 text-center">
            <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-2" />
            <p className="text-destructive font-medium">Failed to load errors</p>
            <p className="text-muted-foreground text-sm">{error.message}</p>
          </div>
        ) : errors.length === 0 ? (
          <div className="py-8 text-center border rounded-lg">
            <Check className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="font-medium">No errors reported</p>
            <p className="text-muted-foreground text-sm">The application is running smoothly</p>
          </div>
        ) : (
          <div className="space-y-4">
            {errors.map(err => (
              <div key={err.id} className={`p-4 border rounded-lg ${err.resolved ? 'bg-gray-50' : 'border-red-200 bg-red-50'}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium truncate">{err.error_message}</h4>
                      {err.resolved ? (
                        <Badge variant="outline" className="bg-green-100 text-green-800">Resolved</Badge>
                      ) : (
                        <Badge variant="destructive">Active</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(err.timestamp || '').toLocaleString()} - {err.component_name || 'Unknown component'}
                    </p>
                  </div>
                  {!err.resolved && (
                    <Button variant="ghost" size="sm" onClick={() => err.id && resolveError(err.id)}>
                      <Check className="h-4 w-4" /> Resolve
                    </Button>
                  )}
                </div>
                {err.error_stack && (
                  <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-24">
                    {err.error_stack}
                  </pre>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
