
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useProjects } from "@/hooks/use-projects";
import { CreateProjectData } from "@/types/project";
import { useAuth } from '@/hooks/use-auth-state';

const projectTypes = [
  { value: "website", label: "Website" },
  { value: "ecommerce", label: "E-Commerce" },
  { value: "saas", label: "SaaS Product" },
  { value: "landing", label: "Landing Page" },
  { value: "portfolio", label: "Portfolio" },
  { value: "blog", label: "Blog" },
  { value: "other", label: "Other" },
];

const NewProject = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { createProject } = useProjects();
  const { user } = useAuth();
  
  const [projectName, setProjectName] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [projectType, setProjectType] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!projectName || !clientName || !clientEmail || !projectType) {
        toast({
          title: "Missing fields",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (!user) {
        toast({
          title: "Authentication error",
          description: "You must be logged in to create a project",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const projectData: CreateProjectData = {
        title: projectName,
        client_name: clientName,
        client_email: clientEmail,
        project_type: projectType,
        description: projectDescription || null,
      };

      await createProject.mutateAsync({
        ...projectData,
        user_id: user.id
      });
      
      navigate("/project-questionnaire");
    } catch (error) {
      console.error("Error creating project:", error);
      // Error is already handled by the mutation
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create New Project</h1>
          <p className="text-gray-600">Set up a new project and customize the client intake process.</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
              <CardDescription>
                Enter the information about your new project. This will help us customize the client questionnaire.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="projectName">Project Name*</Label>
                  <Input
                    id="projectName"
                    placeholder="E.g., Client Website Redesign"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="clientName">Client Name*</Label>
                    <Input
                      id="clientName"
                      placeholder="E.g., Acme Inc."
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clientEmail">Client Email*</Label>
                    <Input
                      id="clientEmail"
                      type="email"
                      placeholder="client@example.com"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="projectType">Project Type*</Label>
                  <Select onValueChange={setProjectType} required>
                    <SelectTrigger id="projectType">
                      <SelectValue placeholder="Select project type" />
                    </SelectTrigger>
                    <SelectContent>
                      {projectTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">This helps us customize the questions for your client.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="projectDescription">Project Description (Optional)</Label>
                  <Textarea
                    id="projectDescription"
                    placeholder="Briefly describe what you're looking to create..."
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    rows={4}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => navigate("/dashboard")}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading || createProject.isPending}>
                  {isLoading || createProject.isPending ? "Creating..." : "Continue to Questionnaire Setup"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default NewProject;
