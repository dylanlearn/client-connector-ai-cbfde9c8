
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Eye, ArrowUpDown } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useCompetitiveElements } from '@/hooks/use-competitive-elements';

export function CompetitiveElementsList() {
  const { elements, isLoading, error } = useCompetitiveElements();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Competitive Elements</h2>
        <Button className="flex items-center gap-2">
          <Plus size={16} />
          <span>Add Element</span>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Element</TableHead>
                  <TableHead>Competitor</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Strengths</TableHead>
                  <TableHead>Weaknesses</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {elements?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No competitive elements found. Add elements to analyze.
                    </TableCell>
                  </TableRow>
                ) : (
                  elements?.map((element) => (
                    <TableRow key={element.id}>
                      <TableCell className="font-medium">
                        {element.name || "Unnamed Element"}
                      </TableCell>
                      <TableCell>{element.competitor_name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{element.element_type}</Badge>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {element.strengths}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {element.weaknesses}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <Eye size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
