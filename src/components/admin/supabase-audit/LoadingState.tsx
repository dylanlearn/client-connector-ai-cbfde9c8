
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export function LoadingState() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Supabase Audit</CardTitle>
        <CardDescription>Checking Supabase services and configuration...</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-center py-10">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-sm text-gray-600">
            Running comprehensive audit of your Supabase instance...
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
