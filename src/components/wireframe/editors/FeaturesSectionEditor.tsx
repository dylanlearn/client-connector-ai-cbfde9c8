
import React from 'react';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { processCopySuggestions } from '../renderers/utilities';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface FeaturesSectionEditorProps {
  section: WireframeSection;
  onUpdate: (updatedSection: WireframeSection) => void;
}

const FeaturesSectionEditor: React.FC<FeaturesSectionEditorProps> = ({
  section,
  onUpdate
}) => {
  // Process copy suggestions into a readable format
  const copySuggestions = processCopySuggestions(section.copySuggestions);
  
  // Extract features from section data
  const features = section.data?.features || [];
  
  // Set up form with default values from section
  const { register, handleSubmit } = useForm({
    defaultValues: {
      heading: copySuggestions.heading || 'Key Features',
      subheading: copySuggestions.subheading || 'Discover what makes our product special',
      features: features.map((f: any) => ({
        title: f.title || '',
        description: f.description || '',
      })) || []
    }
  });
  
  // Handle form submission
  const onSubmit = (data: any) => {
    const updatedSection = {
      ...section,
      copySuggestions: {
        heading: data.heading,
        subheading: data.subheading
      },
      data: {
        ...section.data,
        features: data.features
      }
    };
    
    onUpdate(updatedSection);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Features Section</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="heading">Section Heading</Label>
              <Input
                id="heading"
                placeholder="Enter section heading"
                {...register('heading')}
              />
            </div>
            
            <div>
              <Label htmlFor="subheading">Section Subheading</Label>
              <Textarea
                id="subheading"
                placeholder="Enter section subheading"
                {...register('subheading')}
              />
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Features</h3>
              {features.map((feature: any, index: number) => (
                <div key={index} className="p-4 border rounded-md space-y-3">
                  <div>
                    <Label htmlFor={`features.${index}.title`}>Feature Title</Label>
                    <Input
                      id={`features.${index}.title`}
                      placeholder="Enter feature title"
                      {...register(`features.${index}.title`)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`features.${index}.description`}>Feature Description</Label>
                    <Textarea
                      id={`features.${index}.description`}
                      placeholder="Enter feature description"
                      {...register(`features.${index}.description`)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <Button type="submit">Update Section</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default FeaturesSectionEditor;
