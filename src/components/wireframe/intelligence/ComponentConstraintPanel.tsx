import React, { useState } from 'react';
import { ArrowUpDown } from 'lucide-react';  // Corrected icon import
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableRow
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { useComponentConstraints } from '@/hooks/wireframe/use-component-constraints';

interface ComponentConstraintPanelProps {
  wireframe: WireframeData;
  onUpdateWireframe?: (updated: WireframeData) => void;
}

const ComponentConstraintPanel: React.FC<ComponentConstraintPanelProps> = ({
  wireframe,
  onUpdateWireframe
}) => {
  const {
    constraints,
    constraintTypes,
    analyzing,
    analyze,
    addConstraint,
    updateConstraint,
    removeConstraint,
    applyConstraints
  } = useComponentConstraints(wireframe, onUpdateWireframe);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Component Constraints</CardTitle>
        <CardDescription>
          Define rules to maintain consistency and adaptability across your
          design.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <p>
            <strong>Total Constraints:</strong> {constraints.length}
          </p>
          <button
            onClick={analyze}
            disabled={analyzing}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {analyzing ? 'Analyzing...' : 'Analyze Components'}
          </button>
        </div>

        <Table>
          <TableCaption>
            A list of constraints applied to the wireframe components.
          </TableCaption>
          <TableHead>
            <TableRow>
              <TableHead className="w-[100px]">Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Target</TableHead>
              <TableHead>Rule</TableHead>
              <TableHead>Value</TableHead>
              <TableHead className="text-right">Priority</TableHead>
              <TableHead className="text-center">Enabled</TableHead>
            </TableRow>
          </TableHead>
          <TableBody>
            {constraints.map((constraint, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{constraint.name}</TableCell>
                <TableCell>{constraint.type}</TableCell>
                <TableCell>{constraint.target}</TableCell>
                <TableCell>{constraint.rule}</TableCell>
                <TableCell>{constraint.value}</TableCell>
                <TableCell className="text-right">{constraint.priority}</TableCell>
                <TableCell className="text-center">
                  <Switch
                    id={`constraint-${index}`}
                    checked={constraint.enabled}
                    onCheckedChange={(checked) => {
                      updateConstraint(index, { ...constraint, enabled: checked });
                    }}
                  />
                  <Label htmlFor={`constraint-${index}`} className="sr-only">
                    Enable constraint
                  </Label>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <button
          onClick={applyConstraints}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
        >
          Apply Constraints
        </button>
      </CardContent>
    </Card>
  );
};

export default ComponentConstraintPanel;
