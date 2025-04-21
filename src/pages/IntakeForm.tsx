
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';

type FormValues = {
  businessName: string;
  businessDescription: string;
  projectName: string;
  websiteGoals: string;
  targetAudience: string;
  competitors: string;
  brandColors: string;
  typography: string;
  requiredFeatures: string;
  additionalComments: string;
};

export default function IntakeForm() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('business');
  
  const form = useForm<FormValues>({
    defaultValues: {
      businessName: '',
      businessDescription: '',
      projectName: '',
      websiteGoals: '',
      targetAudience: '',
      competitors: '',
      brandColors: '',
      typography: '',
      requiredFeatures: '',
      additionalComments: '',
    },
  });

  function onSubmit(data: FormValues) {
    console.log(data);
    toast({
      title: "Form submitted",
      description: "We've received your intake form submission.",
    });
  }

  const nextTab = (nextTab: string) => {
    setActiveTab(nextTab);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Project Intake Form</h1>
        <p className="text-gray-600 mb-8">
          Please fill out this form to help us understand your project requirements.
        </p>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
            <CardDescription>
              Fill out the information below to get started with your project.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="mb-8">
                    <TabsTrigger value="business">Business Info</TabsTrigger>
                    <TabsTrigger value="project">Project Goals</TabsTrigger>
                    <TabsTrigger value="design">Design Preferences</TabsTrigger>
                    <TabsTrigger value="features">Features</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="business" className="space-y-6">
                    <FormField
                      control={form.control}
                      name="businessName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your business name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="businessDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe your business or organization"
                              className="min-h-[100px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="projectName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Name for this project" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end">
                      <Button type="button" onClick={() => nextTab('project')}>
                        Next: Project Goals
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="project" className="space-y-6">
                    <FormField
                      control={form.control}
                      name="websiteGoals"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website Goals</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="What are the main goals of your website?"
                              className="min-h-[100px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="targetAudience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Target Audience</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe your target audience or customer base"
                              className="min-h-[100px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="competitors"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Competitors</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="List your main competitors or similar websites you like"
                              className="min-h-[100px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-between">
                      <Button type="button" variant="outline" onClick={() => nextTab('business')}>
                        Back
                      </Button>
                      <Button type="button" onClick={() => nextTab('design')}>
                        Next: Design Preferences
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="design" className="space-y-6">
                    <FormField
                      control={form.control}
                      name="brandColors"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Brand Colors</FormLabel>
                          <FormControl>
                            <Input placeholder="Brand colors (e.g. #ff0000, blue)" {...field} />
                          </FormControl>
                          <FormDescription>
                            Enter your brand colors or color preferences
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="typography"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Typography</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Font preferences or typography style"
                              className="min-h-[100px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-between">
                      <Button type="button" variant="outline" onClick={() => nextTab('project')}>
                        Back
                      </Button>
                      <Button type="button" onClick={() => nextTab('features')}>
                        Next: Features
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="features" className="space-y-6">
                    <FormField
                      control={form.control}
                      name="requiredFeatures"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Required Features</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="What features do you need on your website?"
                              className="min-h-[100px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="additionalComments"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Comments</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Any other information you'd like to share"
                              className="min-h-[100px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-between">
                      <Button type="button" variant="outline" onClick={() => nextTab('design')}>
                        Back
                      </Button>
                      <Button type="submit">Submit Form</Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
