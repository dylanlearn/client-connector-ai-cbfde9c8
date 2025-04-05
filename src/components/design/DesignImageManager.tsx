
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ImageUploader from "@/components/design/ImageUploader";
import { designOptions } from "@/data/design-options";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Image as ImageIcon, RefreshCw, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

export interface UpdatedDesignImage {
  id: string;
  category: string;
  imageUrl: string;
}

const DesignImageManager = () => {
  const [activeTab, setActiveTab] = useState("hero");
  const [updatedImages, setUpdatedImages] = useState<UpdatedDesignImage[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const { user } = useAuth();
  
  // Get unique categories from design options
  const categories = Array.from(new Set(designOptions.map(option => option.category)));
  
  const handleImageUploaded = (url: string, category: string) => {
    // Find the first option of this category or use a random one
    const targetOption = designOptions.find(option => option.category === category);
    
    if (targetOption) {
      const newUpdate = {
        id: targetOption.id,
        category,
        imageUrl: url
      };
      
      setUpdatedImages(prev => {
        // Replace if already exists or add new
        const exists = prev.some(item => item.id === targetOption.id);
        if (exists) {
          return prev.map(item => item.id === targetOption.id ? newUpdate : item);
        } else {
          return [...prev, newUpdate];
        }
      });
      
      toast.success(`Added new image for ${targetOption.title}`);
    }
  };
  
  const applyChanges = async () => {
    if (updatedImages.length === 0) return;
    
    setIsUpdating(true);
    
    try {
      // Call the Supabase Edge Function to update the design options
      const { data, error } = await supabase.functions.invoke('update-design-options', {
        body: { updatedImages }
      });
      
      if (error) throw error;
      
      toast.success(`Successfully updated ${updatedImages.length} design images`);
      console.log("Updated design options:", data);
      
      // Clear the updated images list
      setUpdatedImages([]);
    } catch (error) {
      console.error("Error updating design options:", error);
      toast.error("Failed to update design images. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Custom Design Images</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">Sign in required</p>
            <p className="text-sm text-muted-foreground mt-2">
              Please sign in to upload and manage custom design images
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Custom Design Images</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {categories.map((category) => (
            <TabsContent key={category} value={category}>
              <ImageUploader 
                onImageUploaded={handleImageUploaded}
                category={category}
              />
              
              {updatedImages.filter(img => img.category === category).length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">New Images:</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {updatedImages
                      .filter(img => img.category === category)
                      .map((img, idx) => (
                        <div key={idx} className="relative aspect-video border rounded overflow-hidden">
                          <img 
                            src={img.imageUrl} 
                            alt={`Custom ${category} ${idx}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
          ))}
          
          {updatedImages.length > 0 && (
            <div className="mt-6 flex justify-end">
              <Button onClick={applyChanges} disabled={isUpdating}>
                {isUpdating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Apply Changes
                  </>
                )}
              </Button>
            </div>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DesignImageManager;
