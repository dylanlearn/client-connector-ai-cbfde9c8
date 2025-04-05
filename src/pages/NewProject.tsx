import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { ProjectService } from "@/services/project-service";
import { CreateProjectData } from "@/types/project";
import { useAuth } from '@/hooks/use-auth';

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
        toast.error("Missing fields", {
          description: "Please fill in all required fields"
        });
        setIsLoading(false);
        return;
      }

      if (!user) {
        toast.error("Authentication error", {
          description: "You must be logged in to create a project"
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
        user_id: user.id,
        status: 'draft'
      };

      await ProjectService.createProject(projectData);
      toast.success("Project created successfully");
      navigate("/project-questionnaire");
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Failed to create project", {
        description: "An error occurred while creating your project. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
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
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Continue to Questionnaire Setup"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default NewProject;
