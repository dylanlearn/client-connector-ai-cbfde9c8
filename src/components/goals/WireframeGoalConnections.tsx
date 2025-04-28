
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Link2, Unlink } from 'lucide-react';
import { useWireframeGoalConnections } from '@/hooks/use-wireframe-goal-connections';
import { AlertMessage } from '@/components/ui/alert-message';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface WireframeGoalConnectionsProps {
  wireframeId?: string;
}

export function WireframeGoalConnections({ wireframeId }: WireframeGoalConnectionsProps) {
  const { 
    connections, 
    isLoading, 
    error, 
    deleteConnection
  } = useWireframeGoalConnections(wireframeId);
  
  if (error) {
    return <AlertMessage type="error" title="Error loading connections">{error.message}</AlertMessage>;
  }
  
  if (!wireframeId) {
    return <AlertMessage type="warning" title="No wireframe selected">Select a wireframe to view goal connections.</AlertMessage>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Wireframe-Goal Connections</h2>
        <Button disabled={!wireframeId} className="flex items-center gap-2">
          <Plus size={16} />
          <span>Add Connection</span>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : connections?.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            <p>No goal connections found. Connect wireframe elements to project goals and KPIs.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Element ID</TableHead>
                  <TableHead>Goal</TableHead>
                  <TableHead>KPI</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Impact</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {connections.map((connection) => (
                  <TableRow key={connection.id}>
                    <TableCell className="font-medium">{connection.element_id}</TableCell>
                    <TableCell>{connection.goal_title}</TableCell>
                    <TableCell>{connection.kpi_name || '-'}</TableCell>
                    <TableCell>
                      <PriorityBadge priority={connection.priority} />
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {connection.impact_description || '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => deleteConnection(connection.id)}
                      >
                        <Unlink size={16} className="text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface PriorityBadgeProps {
  priority: number;
}

function PriorityBadge({ priority }: PriorityBadgeProps) {
  const colors = {
    1: 'bg-green-100 text-green-800 hover:bg-green-200',
    2: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
    3: 'bg-amber-100 text-amber-800 hover:bg-amber-200',
    4: 'bg-orange-100 text-orange-800 hover:bg-orange-200',
    5: 'bg-red-100 text-red-800 hover:bg-red-200',
  };

  return (
    <Badge className={colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
      P{priority}
    </Badge>
  );
}
