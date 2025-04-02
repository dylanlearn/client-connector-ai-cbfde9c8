
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface Role {
  id: string;
  label: string;
}

interface RoleSelectionStepProps {
  roles: Role[];
  onContinue: (selectedRole: string) => void;
}

export function RoleSelectionStep({ roles, onContinue }: RoleSelectionStepProps) {
  const [selectedRole, setSelectedRole] = useState("");
  const { toast } = useToast();

  const handleContinue = () => {
    if (!selectedRole) {
      toast({
        title: "Please select an option",
        description: "Let us know what brings you to DezignSync.",
        variant: "destructive",
      });
      return;
    }
    
    onContinue(selectedRole);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl md:text-3xl text-center">
          What brings you to DezignSync?
        </CardTitle>
        <CardDescription className="text-center text-base md:text-lg">
          Help us personalize your experience.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roles.map((role) => (
            <div 
              key={role.id}
              className={`border rounded-lg p-4 cursor-pointer hover:border-indigo-600 transition-colors
                ${selectedRole === role.id ? "border-indigo-600 bg-indigo-50" : "border-gray-200"}
              `}
              onClick={() => setSelectedRole(role.id)}
            >
              <div className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded-full border ${selectedRole === role.id ? "bg-indigo-600 border-indigo-600" : "border-gray-300"}`}></div>
                <span className="font-medium">{role.label}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button 
          onClick={handleContinue}
          className="w-full md:w-auto px-8"
        >
          Continue
        </Button>
      </CardFooter>
    </Card>
  );
}
