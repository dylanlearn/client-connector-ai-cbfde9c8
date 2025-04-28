
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RefreshCw, Plus, ArrowRightLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ExternalServiceConnector } from '@/services/external-service/external-service-connector';
import type { ExternalServiceMapping } from '@/types/external-service';

interface ServiceMappingsProps {
  connectionId: string | null;
  isConnectionSelected: boolean;
}

export function ServiceMappings({ 
  connectionId, 
  isConnectionSelected 
}: ServiceMappingsProps) {
  const [mappings, setMappings] = useState<ExternalServiceMapping[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [sourceField, setSourceField] = useState('');
  const [targetField, setTargetField] = useState('');
  const [transformationRule, setTransformationRule] = useState('');
  const [isRequired, setIsRequired] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (connectionId) {
      loadMappings();
    }
  }, [connectionId]);

  const loadMappings = async () => {
    if (!connectionId) return;

    setIsLoading(true);
    try {
      const data = await ExternalServiceConnector.getFieldMappings(connectionId);
      setMappings(data);
    } catch (error) {
      console.error("Error loading field mappings:", error);
      toast({
        title: "Error loading mappings",
        description: "Failed to load field mappings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createMapping = async () => {
    if (!connectionId || !sourceField || !targetField) return;

    setIsCreating(true);
    try {
      await ExternalServiceConnector.createFieldMapping(
        connectionId,
        sourceField,
        targetField,
        transformationRule || undefined,
        isRequired
      );
      setShowDialog(false);
      resetForm();
      loadMappings();
      toast({
        title: "Mapping created",
        description: "Field mapping has been created successfully.",
      });
    } catch (error) {
      console.error("Error creating mapping:", error);
      toast({
        title: "Error creating mapping",
        description: "Failed to create field mapping. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const resetForm = () => {
    setSourceField('');
    setTargetField('');
    setTransformationRule('');
    setIsRequired(false);
  };

  if (!isConnectionSelected) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Select a service connection to view and manage field mappings.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Field Mappings</h3>
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={loadMappings} disabled={isLoading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Mapping
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Field Mapping</DialogTitle>
                <DialogDescription>
                  Map fields between your design system and the external service.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="sourceField">Source Field</Label>
                  <Input 
                    id="sourceField" 
                    value={sourceField} 
                    onChange={(e) => setSourceField(e.target.value)}
                    placeholder="e.g., design.color.primary"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="targetField">Target Field</Label>
                  <Input 
                    id="targetField" 
                    value={targetField} 
                    onChange={(e) => setTargetField(e.target.value)}
                    placeholder="e.g., variables.colors.primary"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="transformationRule">Transformation Rule (optional)</Label>
                  <Input 
                    id="transformationRule" 
                    value={transformationRule} 
                    onChange={(e) => setTransformationRule(e.target.value)}
                    placeholder="e.g., uppercase, lowercase, format"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isRequired"
                    checked={isRequired}
                    onCheckedChange={setIsRequired}
                  />
                  <Label htmlFor="isRequired">Required Field</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
                <Button 
                  onClick={createMapping} 
                  disabled={isCreating || !sourceField || !targetField}
                >
                  {isCreating ? "Creating..." : "Create Mapping"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : mappings.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No field mappings found. Create a mapping to define how data is synced between systems.
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Source Field</TableHead>
                  <TableHead className="text-center w-10"><ArrowRightLeft className="h-4 w-4 mx-auto" /></TableHead>
                  <TableHead>Target Field</TableHead>
                  <TableHead>Transformation</TableHead>
                  <TableHead className="text-center">Required</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mappings.map(mapping => (
                  <TableRow key={mapping.id}>
                    <TableCell className="font-medium">{mapping.source_field}</TableCell>
                    <TableCell className="text-center">→</TableCell>
                    <TableCell>{mapping.target_field}</TableCell>
                    <TableCell className="text-muted-foreground">{mapping.transformation_rule || '-'}</TableCell>
                    <TableCell className="text-center">
                      {mapping.is_required ? (
                        <div className="h-2 w-2 rounded-full bg-green-500 mx-auto" />
                      ) : (
                        <div className="h-2 w-2 rounded-full bg-gray-300 mx-auto" />
                      )}
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
