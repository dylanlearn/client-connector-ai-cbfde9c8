
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDesignProcess } from '@/contexts/design-process/DesignProcessProvider';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight, ClipboardList } from 'lucide-react';
import { useForm } from 'react-hook-form';

const ClientDesignIntake = () => {
  const { updateIntakeData, intakeData, generateDesignBrief } = useDesignProcess();
  
  const { register, handleSubmit, formState: { errors, isValid } } = useForm({
    defaultValues: intakeData || {
      projectName: '',
      projectDescription: '',
      siteType: '',
      designStyle: '',
      targetAudience: '',
      mainFeatures: '',
    }
  });

  const onSubmit = (data: any) => {
    updateIntakeData(data);
    generateDesignBrief();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5" />
          Client Intake Form
        </CardTitle>
        <CardDescription>
          Gather client information to inform the design process
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="projectName">Project Name</Label>
              <Input
                id="projectName"
                placeholder="Enter project name"
                {...register("projectName", { required: true })}
              />
              {errors.projectName && (
                <p className="text-sm text-red-500">Project name is required</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="siteType">Site Type</Label>
              <Input
                id="siteType"
                placeholder="E.g. E-commerce, Portfolio, Blog"
                {...register("siteType", { required: true })}
              />
              {errors.siteType && (
                <p className="text-sm text-red-500">Site type is required</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="projectDescription">Project Description</Label>
            <Textarea
              id="projectDescription"
              placeholder="Describe the project and its goals"
              rows={3}
              {...register("projectDescription", { required: true })}
            />
            {errors.projectDescription && (
              <p className="text-sm text-red-500">Project description is required</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="designStyle">Design Style Preference</Label>
              <Input
                id="designStyle"
                placeholder="E.g. Modern, Minimalist, Bold"
                {...register("designStyle")}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="mainFeatures">Main Features</Label>
              <Input
                id="mainFeatures"
                placeholder="E.g. Contact Form, Portfolio Gallery"
                {...register("mainFeatures")}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="targetAudience">Target Audience</Label>
            <Textarea
              id="targetAudience"
              placeholder="Describe the target audience for this project"
              rows={2}
              {...register("targetAudience", { required: true })}
            />
            {errors.targetAudience && (
              <p className="text-sm text-red-500">Target audience is required</p>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button">
            Save Draft
          </Button>
          <Button type="submit" disabled={!isValid} className="gap-2">
            Generate Design Brief
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ClientDesignIntake;
