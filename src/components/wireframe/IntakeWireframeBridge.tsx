
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useEnhancedWireframe } from '@/hooks/use-enhanced-wireframe';
import { v4 as uuidv4 } from 'uuid';
import AdvancedWireframeGenerator from './AdvancedWireframeGenerator';

interface IntakeWireframeBridgeProps {
  intakeData: any;
  onWireframeGenerated?: (wireframe: any) => void;
  projectId?: string;
}

const IntakeWireframeBridge: React.FC<IntakeWireframeBridgeProps> = ({
  intakeData,
  onWireframeGenerated,
  projectId
}) => {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [wireframeData, setWireframeData] = useState<any>(null);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const { toast } = useToast();
  const { generateFromIntakeData } = useEnhancedWireframe();

  const generateWireframe = async () => {
    setIsGenerating(true);
    
    try {
      toast({
        title: "Generating wireframe",
        description: "Creating wireframe from your project information..."
      });
      
      const result = await generateFromIntakeData(intakeData, projectId || uuidv4());
      
      if (result && result.wireframe) {
        setWireframeData(result.wireframe);
        
        if (onWireframeGenerated) {
          onWireframeGenerated(result.wireframe);
        }
        
        toast({
          title: "Wireframe generated",
          description: "Successfully created wireframe from intake data"
        });
      } else {
        toast({
          title: "Generation failed",
          description: "Failed to generate wireframe from intake data",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error generating wireframe from intake data:", error);
      toast({
        title: "Generation error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleShowAdvanced = () => {
    setShowAdvanced(true);
  };

  return (
    <div className="intake-wireframe-bridge">
      {showAdvanced ? (
        <AdvancedWireframeGenerator 
          projectId={projectId}
          intakeData={intakeData}
          onWireframeGenerated={onWireframeGenerated}
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Generate Wireframe</CardTitle>
            <CardDescription>
              Create a wireframe based on your project information
            </CardDescription>
          </CardHeader>
          <CardContent>
            {wireframeData ? (
              <div className="flex flex-col items-center space-y-4">
                <div className="bg-emerald-50 text-emerald-800 p-3 rounded-md">
                  <p className="text-sm font-medium">Wireframe successfully generated!</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Your wireframe "{wireframeData.title}" is ready to view and edit.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  We can automatically generate a wireframe based on the information you provided in the intake form.
                </p>
                <div className="bg-amber-50 text-amber-800 p-3 rounded-md">
                  <p className="text-sm">This will create a wireframe with:</p>
                  <ul className="text-sm list-disc ml-5 mt-2">
                    <li>Brand colors from your intake form</li>
                    <li>Sections based on your business type</li>
                    <li>Components tailored to your industry</li>
                    <li>Copy suggestions based on your business description</li>
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleShowAdvanced}
            >
              Advanced Editor
            </Button>
            {!wireframeData && (
              <Button 
                onClick={generateWireframe} 
                disabled={isGenerating || !intakeData}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 mr-2" />
                    Generate Wireframe
                  </>
                )}
              </Button>
            )}
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default IntakeWireframeBridge;
