
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function SupabaseAudit() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Supabase Audit Dashboard</CardTitle>
        <CardDescription>
          Comprehensive audit of your Supabase project configuration and service health
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <iframe 
          src="/admin/supabase-audit" 
          className="w-full h-[600px] border rounded-md"
          title="Supabase Audit Dashboard"
        />
      </CardContent>
    </Card>
  );
}
