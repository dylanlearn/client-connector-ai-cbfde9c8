import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Project } from '@/types/project';
import { Sparkles, Grid3X3, PanelLeft, Rocket, Lightbulb, Wand2 } from 'lucide-react';
import WireframeList from '../components/AI/WireframeList';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { questionnaireWireframeBridge } from '@/services/wireframe/questionnaire-wireframe-bridge';
import { useDesignRecommendations } from '@/contexts/ai/hooks/useDesignRecommendations';
import { useIntakeForm } from '@/hooks/intake-form';
import { Badge } from '@/components/ui/badge';
import { IntakeFormData } from '@/types/intake-form';
import { useWireframeGeneration } from '@/hooks/use-wireframe-generation';
import DashboardTabContent from '@/components/dashboard/tabs/DashboardTabContent';

interface ProjectWireframesTabProps {
  project: Project;
}

const ProjectWireframesTab: React.FC<ProjectWireframesTabProps> = ({ project }) => {
  const navigate = useNavigate();
  const { formData, hasInProgressForm } = useIntakeForm();
  const { designRecommendations } = useDesignRecommendations();
  const { isGenerating, generateWireframe, wireframes, loadProjectWireframes } = useWireframeGeneration();
  const [activeTab, setActiveTab] = useState<string>("wireframes");
  const [intakeData, setIntakeData] = useState<IntakeFormData | null>(null);
  const [hasLoadedWireframes, setHasLoadedWireframes] = useState(false);

  useEffect(() => {
    if (project?.id && !hasLoadedWireframes) {
      loadProjectWireframes(project.id);
      setHasLoadedWireframes(true);
    }
  }, [project?.id, loadProjectWireframes, hasLoadedWireframes]);

  useEffect(() => {
    if (formData && Object.keys(formData).length > 0) {
      setIntakeData(formData);
    }
  }, [formData]);

  const handleGenerateFromQuestionnaire = async () => {
    if (!intakeData || !project.id) return;
    
    const enhancedIntakeData = {
      ...intakeData,
      formId: project.id
    };

    try {
      const wireframeParams = questionnaireWireframeBridge.transformIntakeToWireframeParams(
        enhancedIntakeData,
        Array.isArray(designRecommendations) && designRecommendations.length > 0 ? designRecommendations[0] : null
      );
      
      if (!wireframeParams.description) {
        wireframeParams.description = intakeData.projectDescription || 
                                     `Website for ${intakeData.projectName || 'client'}`;
      }
      
      const generationParams = {
        ...wireframeParams,
        description: wireframeParams.description || "New website wireframe",
        projectId: project.id
      };
      
      const result = await generateWireframe(generationParams);
      
      if (result) {
        loadProjectWireframes(project.id);
      }
    } catch (error) {
      console.error("Error generating wireframe:", error);
    }
  };

  const getIntakeCompletionPercentage = (): number => {
    if (!intakeData) return 0;
    
    const requiredFields = ['siteType', 'projectName', 'projectDescription', 'targetAudience'];
    const completedFields = requiredFields.filter(field => Boolean(intakeData[field as keyof IntakeFormData]));
    
    return Math.round((completedFields.length / requiredFields.length) * 100);
  };

  const intakeCompletionPercentage = getIntakeCompletionPercentage();
  const hasEnoughData = intakeCompletionPercentage >= 50;
  
  const getRecommendedSections = (): string[] => {
    if (!intakeData) return ['hero', 'features', 'footer'];
    return questionnaireWireframeBridge.getRecommendedSections(intakeData);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="wireframes" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="wireframes">
            <Sparkles className="h-4 w-4 mr-2" />
            Wireframes
          </TabsTrigger>
          <TabsTrigger value="components">
            <Grid3X3 className="h-4 w-4 mr-2" />
            Components
          </TabsTrigger>
          <TabsTrigger value="insights">
            <Lightbulb className="h-4 w-4 mr-2" />
            Insights
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="wireframes">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Wireframes</h3>
            <div className="space-x-2">
              <Button 
                variant="secondary"
                onClick={() => navigate(`/project/${project.id}/advanced-wireframe`)}
                disabled={!project.id}
              >
                <Wand2 className="h-4 w-4 mr-2" />
                Advanced Generator
              </Button>
            </div>
          </div>
        
          {!hasInProgressForm() && intakeCompletionPercentage < 25 && (
            <Alert className="mb-6 border-blue-200 bg-blue-50">
              <Rocket className="h-5 w-5 text-blue-500" />
              <AlertTitle>Supercharge your wireframe with client data</AlertTitle>
              <AlertDescription className="flex flex-col gap-4">
                <p>
                  Complete the client questionnaire to generate wireframes that are precisely 
                  tailored to your client's needs and preferences.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/intake-form')}
                  className="w-fit"
                >
                  Complete Questionnaire
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {intakeData && intakeCompletionPercentage > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Rocket className="h-5 w-5 mr-2 text-primary" />
                    Client Intake Data
                  </CardTitle>
                  <Badge variant={hasEnoughData ? "success" : "outline"}>
                    {intakeCompletionPercentage}% Complete
                  </Badge>
                </div>
                <CardDescription>
                  Use your client's preferences to generate customized wireframes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Site Type</h4>
                    <p className="text-sm text-gray-600">{intakeData.siteType || "Not specified"}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-1">Design Style</h4>
                    <p className="text-sm text-gray-600">{intakeData.designStyle || "Not specified"}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-1">Target Audience</h4>
                    <p className="text-sm text-gray-600">
                      {intakeData.targetAudience 
                        ? intakeData.targetAudience.substring(0, 100) + (intakeData.targetAudience.length > 100 ? '...' : '')
                        : "Not specified"}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-1">Key Features</h4>
                    <p className="text-sm text-gray-600">
                      {intakeData.mainFeatures || "Not specified"}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Recommended Sections</h4>
                  <div className="flex flex-wrap gap-2">
                    {getRecommendedSections().map((section) => (
                      <Badge key={section} variant="outline" className="capitalize">
                        {section.replace('-', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button 
                  className="mt-4 w-full sm:w-auto"
                  onClick={handleGenerateFromQuestionnaire}
                  disabled={isGenerating || intakeCompletionPercentage < 25}
                >
                  {isGenerating ? "Generating..." : "Generate Wireframe from Questionnaire"}
                </Button>
              </CardContent>
            </Card>
          )}

          <DashboardTabContent
            isLoading={!hasLoadedWireframes}
            skeletonCount={3}
            skeletonHeight="h-64"
          >
            <WireframeList projectId={project.id} />
          </DashboardTabContent>
        </TabsContent>
        
        <TabsContent value="components">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Grid3X3 className="h-5 w-5 mr-2 text-primary" />
                Design Elements Library
              </CardTitle>
              <CardDescription>
                Reusable components extracted from your wireframes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {wireframes.length > 0 ? (
                  <p className="text-gray-500 col-span-full">
                    Component extraction in progress. Components will appear here as they're identified from your wireframes.
                  </p>
                ) : (
                  <p className="text-gray-500 col-span-full">
                    Generate some wireframes first to populate your component library.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="insights">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="h-5 w-5 mr-2 text-primary" />
                Design Insights
              </CardTitle>
              <CardDescription>
                AI-powered analysis of your wireframes and design patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">
                Design insights will be generated as you create more wireframes.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectWireframesTab;
