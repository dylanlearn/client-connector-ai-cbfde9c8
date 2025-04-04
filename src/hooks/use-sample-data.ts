
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';

export const useSampleData = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const generateSampleData = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to generate sample data",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Check if user already has projects
      const { data: existingProjects } = await supabase
        .from('projects')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);
        
      if (existingProjects && existingProjects.length > 0) {
        // User already has projects, no need to create sample data
        return;
      }
      
      // Create a sample project
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert({
          title: 'Demo Website Project',
          client_name: 'ACME Corporation',
          client_email: 'client@example.com',
          project_type: 'business',
          description: 'A demonstration business website with modern design',
          user_id: user.id,
          status: 'active'
        })
        .select()
        .single();
        
      if (projectError) throw projectError;
      
      // Add sample design tokens
      await supabase.from('design_tokens').insert([
        {
          name: 'Primary',
          category: 'color',
          value: { value: '#3B82F6', variants: { light: '#60A5FA', dark: '#2563EB' } },
          project_id: project.id,
          description: 'Primary brand color'
        },
        {
          name: 'Secondary',
          category: 'color',
          value: { value: '#10B981', variants: { light: '#34D399', dark: '#059669' } },
          project_id: project.id,
          description: 'Secondary accent color'
        },
        {
          name: 'Heading',
          category: 'typography',
          value: { 
            fontFamily: 'Inter, sans-serif', 
            fontWeight: 700, 
            fontSize: { base: '2rem', sm: '1.5rem', lg: '2.5rem' } 
          },
          project_id: project.id,
          description: 'Heading typography'
        }
      ]);
      
      // Add a sample wireframe
      await supabase.from('ai_wireframes').insert({
        prompt: 'Modern business landing page with hero section and services overview',
        description: 'A clean, professional landing page for a business consulting firm',
        project_id: project.id,
        generation_params: {
          style: 'modern-minimalist',
          colorScheme: 'blue',
          sections: ['hero', 'services', 'testimonials', 'contact']
        }
      });
      
      // Add sample animation preferences
      await supabase.from('animation_preferences').insert({
        animation_type: 'scroll_reveal',
        user_id: user.id,
        enabled: true,
        intensity_preference: 7
      });
      
      toast({
        title: "Sample data created",
        description: "Demo project and assets have been generated successfully.",
      });
      
      // Refresh the page to show new data
      window.location.reload();
      
    } catch (error) {
      console.error('Error creating sample data:', error);
      toast({
        title: "Error creating sample data",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    }
  };
  
  return { generateSampleData };
};
