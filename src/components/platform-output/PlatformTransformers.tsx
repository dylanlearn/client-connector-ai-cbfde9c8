
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { RefreshCw, Plus, Components } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PlatformOutputService } from '@/services/platform-output/platform-output-service';
import type { PlatformTransformer } from '@/types/platform-output';

interface PlatformTransformersProps {
  platformId: string | null;
  isPlatformSelected: boolean;
}

export function PlatformTransformers({ 
  platformId, 
  isPlatformSelected 
}: PlatformTransformersProps) {
  const [transformers, setTransformers] = useState<PlatformTransformer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [componentType, setComponentType] = useState('');
  const [transformationRules, setTransformationRules] = useState('{}');
  const [specificProperties, setSpecificProperties] = useState('{}');
  const { toast } = useToast();

  useEffect(() => {
    if (platformId) {
      loadTransformers();
    }
  }, [platformId]);

  const loadTransformers = async () => {
    if (!platformId) return;

    setIsLoading(true);
    try {
      const data = await PlatformOutputService.getTransformers(platformId);
      setTransformers(data);
    } catch (error) {
      console.error("Error loading transformers:", error);
      toast({
        title: "Error loading transformers",
        description: "Failed to load component transformers. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createTransformer = async () => {
    if (!platformId || !componentType) return;

    let parsedRules: Record<string, any>;
    let parsedProperties: Record<string, any> | undefined;

    try {
      parsedRules = JSON.parse(transformationRules);
      parsedProperties = specificProperties ? JSON.parse(specificProperties) : undefined;
    } catch (e) {
      console.error("Invalid JSON configuration");
      return;
    }

    setIsCreating(true);
    try {
      await PlatformOutputService.createTransformer(
        platformId,
        componentType,
        parsedRules,
        parsedProperties
      );
      setShowDialog(false);
      resetForm();
      loadTransformers();
      toast({
        title: "Transformer created",
        description: "Component transformer has been created successfully.",
      });
    } catch (error) {
      console.error("Error creating transformer:", error);
      toast({
        title: "Error creating transformer",
        description: "Failed to create component transformer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const resetForm = () => {
    setComponentType('');
    setTransformationRules('{}');
    setSpecificProperties('{}');
  };

  if (!isPlatformSelected) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Select a platform configuration to view and manage component transformers.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Component Transformers</h3>
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={loadTransformers} disabled={isLoading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Transformer
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Component Transformer</DialogTitle>
                <DialogDescription>
                  Define rules for transforming a wireframe component to platform-specific code.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="componentType">Component Type</Label>
                  <Input 
                    id="componentType" 
                    value={componentType} 
                    onChange={(e) => setComponentType(e.target.value)}
                    placeholder="e.g., button, card, input"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="transformationRules">Transformation Rules (JSON)</Label>
                  <Textarea 
                    id="transformationRules" 
                    value={transformationRules} 
                    onChange={(e) => setTransformationRules(e.target.value)}
                    placeholder="{}"
                    className="font-mono text-sm h-20"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="specificProperties">Platform-specific Properties (Optional)</Label>
                  <Textarea 
                    id="specificProperties" 
                    value={specificProperties} 
                    onChange={(e) => setSpecificProperties(e.target.value)}
                    placeholder="{}"
                    className="font-mono text-sm h-20"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
                <Button 
                  onClick={createTransformer} 
                  disabled={isCreating || !componentType || !transformationRules}
                >
                  {isCreating ? "Creating..." : "Create Transformer"}
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
      ) : transformers.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No component transformers found. Create transformers to define how components are transformed to platform code.
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Component Type</TableHead>
                  <TableHead>Transformation Rules</TableHead>
                  <TableHead>Platform-specific Properties</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transformers.map(transformer => (
                  <TableRow key={transformer.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Components className="h-4 w-4" />
                        {transformer.component_type}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => {
                        // Show rules in a modal or copy to clipboard
                        navigator.clipboard.writeText(JSON.stringify(transformer.transformation_rules, null, 2));
                        toast({
                          title: "Copied to clipboard",
                          description: "Transformation rules copied to clipboard.",
                        });
                      }}>
                        View Rules
                      </Button>
                    </TableCell>
                    <TableCell>
                      {transformer.platform_specific_properties ? (
                        <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => {
                          // Show properties in a modal or copy to clipboard
                          navigator.clipboard.writeText(JSON.stringify(transformer.platform_specific_properties, null, 2));
                          toast({
                            title: "Copied to clipboard",
                            description: "Platform-specific properties copied to clipboard.",
                          });
                        }}>
                          View Properties
                        </Button>
                      ) : (
                        <span className="text-muted-foreground text-sm">None</span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(transformer.created_at).toLocaleDateString()}
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
