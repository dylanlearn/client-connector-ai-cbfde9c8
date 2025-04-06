
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createSimpleABTest } from '@/utils/ab-testing/createCopyTest';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from "lucide-react";

export const CopyTestCreator: React.FC = () => {
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [testName, setTestName] = useState('');
  const [contentType, setContentType] = useState('header');
  const [controlText, setControlText] = useState('');
  const [variantText, setVariantText] = useState('');
  const [description, setDescription] = useState('');
  
  const handleCreateTest = async () => {
    if (!testName || !contentType || !controlText || !variantText) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    setIsCreating(true);
    try {
      const testId = await createSimpleABTest(
        testName,
        contentType,
        controlText,
        variantText,
        description
      );
      
      if (testId) {
        toast({
          title: "Test Created",
          description: "Your A/B copy test has been created successfully."
        });
        // Reset the form
        setTestName('');
        setContentType('header');
        setControlText('');
        setVariantText('');
        setDescription('');
      } else {
        throw new Error("Failed to create test");
      }
    } catch (error) {
      console.error("Error creating test:", error);
      toast({
        title: "Error",
        description: "Failed to create A/B copy test.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Copy A/B Test</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="testName">Test Name</Label>
            <Input
              id="testName"
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
              placeholder="Homepage Header Test"
            />
          </div>
          
          <div>
            <Label htmlFor="contentType">Content Type</Label>
            <select
              id="contentType"
              className="w-full p-2 border rounded"
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
            >
              <option value="header">Header</option>
              <option value="tagline">Tagline</option>
              <option value="cta">Call to Action</option>
              <option value="description">Description</option>
            </select>
          </div>
          
          <div>
            <Label htmlFor="controlText">Control Text (Version A)</Label>
            <Textarea
              id="controlText"
              value={controlText}
              onChange={(e) => setControlText(e.target.value)}
              placeholder="Enter your control copy here..."
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="variantText">Variant Text (Version B)</Label>
            <Textarea
              id="variantText"
              value={variantText}
              onChange={(e) => setVariantText(e.target.value)}
              placeholder="Enter your variant copy here..."
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the purpose of this test..."
              rows={2}
            />
          </div>
          
          <Button 
            onClick={handleCreateTest}
            disabled={isCreating}
            className="w-full"
          >
            {isCreating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Test...
              </>
            ) : "Create A/B Test"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
