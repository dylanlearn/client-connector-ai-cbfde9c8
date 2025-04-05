
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ImageUploader from "@/components/design/ImageUploader";
import { designOptions } from "@/data/design-options";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Image as ImageIcon, RefreshCw } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export interface UpdatedDesignImage {
  id: string;
  category: string;
  imageUrl: string;
}

const DesignImageManager = () => {
  const [activeTab, setActiveTab] = useState("hero");
  const [updatedImages, setUpdatedImages] = useState<UpdatedDesignImage[]>([]);
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
  
  const applyChanges = () => {
    // In a real application, this would update the database
    // For now, we're just showing a success message
    toast.success(`${updatedImages.length} images are ready to be applied`);
    
    // Display information about which images would be updated
    if (updatedImages.length > 0) {
      console.log("Images to be updated:", updatedImages);
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
              <Button onClick={applyChanges}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Apply Changes
              </Button>
            </div>
          )}
        </CardContent>
      </Tabs>
    </Card>
  );
};

export default DesignImageManager;
