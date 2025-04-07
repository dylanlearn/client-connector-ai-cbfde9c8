
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Cpu, Database, Server } from "lucide-react";

export function SystemOptimization() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Optimization Status</CardTitle>
        <CardDescription>Database-centric operations have been moved to efficient PostgreSQL functions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Database className="h-5 w-5" />
          <AlertTitle>PostgreSQL Functions Optimized</AlertTitle>
          <AlertDescription>
            Critical operations have been moved to PostgreSQL RPC functions, reducing the load on edge functions.
          </AlertDescription>
        </Alert>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Edge Functions Usage</span>
            <span className="text-green-600">Optimized</span>
          </div>
          <Progress value={35} className="h-2" />
          <p className="text-xs text-gray-500">4/16 edge functions in use (75% reduction)</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="flex items-center gap-2">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Server className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="text-sm font-medium">Error Handling</div>
              <div className="text-xs text-gray-500">RPC optimized</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="bg-green-100 p-2 rounded-lg">
              <Database className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <div className="text-sm font-medium">Feedback Analysis</div>
              <div className="text-xs text-gray-500">RPC optimized</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Cpu className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <div className="text-sm font-medium">Design Memory</div>
              <div className="text-xs text-gray-500">RPC optimized</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="bg-amber-100 p-2 rounded-lg">
              <Server className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <div className="text-sm font-medium">Interaction Analytics</div>
              <div className="text-xs text-gray-500">RPC optimized</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
