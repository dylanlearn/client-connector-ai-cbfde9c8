
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, RefreshCw, Save } from "lucide-react";
import { useDesignImageGeneration } from "@/hooks/use-design-image-generation";

interface ImageGenerationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  designType: string;
  designTitle: string;
  designDescription: string;
  onSave: (imageUrl: string) => void;
}

export function ImageGenerationDialog({
  open,
  onOpenChange,
  designType,
  designTitle,
  designDescription,
  onSave
}: ImageGenerationDialogProps) {
  const [description, setDescription] = useState(designDescription);
  const [style, setStyle] = useState("");
  
  const { isGenerating, generatedImageUrl, error, generateImage, retryCount } = useDesignImageGeneration();
  
  const handleGenerate = async () => {
    const result = await generateImage(designType, description, style);
    if (result) {
      // Auto-switch to preview tab when generation is successful
      document.querySelector('[data-state="inactive"][value="preview"]')?.click();
    }
  };
  
  const handleSave = () => {
    if (generatedImageUrl) {
      onSave(generatedImageUrl);
      onOpenChange(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[725px]">
        <DialogHeader>
          <DialogTitle>Generate Design Image</DialogTitle>
          <DialogDescription>
            Create a custom image for {designTitle} using AI.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="generate">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generate">Generate</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          
          <TabsContent value="generate" className="space-y-4">
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="design-type" className="text-right">
                  Design Type
                </Label>
                <Input
                  id="design-type"
                  value={designType}
                  className="col-span-3"
                  disabled
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="col-span-3"
                  rows={3}
                  placeholder="Describe the design you want to generate..."
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="style" className="text-right">
                  Style
                </Label>
                <Input
                  id="style"
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="col-span-3"
                  placeholder="modern, minimalist, colorful, etc."
                />
              </div>
            </div>
            
            {error && (
              <div className="bg-destructive/10 text-destructive p-3 rounded-md flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium">Error generating image</p>
                  <p>{error}</p>
                  {retryCount > 0 && (
                    <p className="mt-1">Retry attempt {retryCount}</p>
                  )}
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button 
                type="button" 
                onClick={handleGenerate}
                disabled={isGenerating || !description}
              >
                {isGenerating && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
                {isGenerating ? "Generating..." : "Generate Image"}
              </Button>
            </DialogFooter>
          </TabsContent>
          
          <TabsContent value="preview" className="space-y-4">
            <div className="aspect-video w-full bg-muted rounded-md overflow-hidden flex items-center justify-center">
              {generatedImageUrl ? (
                <img 
                  src={generatedImageUrl} 
                  alt="Generated design" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center text-muted-foreground">
                  <p>No image generated yet</p>
                  <p className="text-sm">Go to the Generate tab to create an image</p>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                onClick={handleSave}
                disabled={!generatedImageUrl}
                variant="default"
              >
                <Save className="mr-2 h-4 w-4" />
                Save Image
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
