
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, Download, Image, LoaderCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDesignImageGeneration } from "@/hooks/use-design-image-generation";
import { toast } from "sonner";

interface StyleGuideImageGeneratorProps {
  className?: string;
}

export function StyleGuideImageGenerator({ className }: StyleGuideImageGeneratorProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("create");
  const [styleType, setStyleType] = useState("ui-design");
  const [description, setDescription] = useState("");
  const [styleKeywords, setStyleKeywords] = useState("");
  const [savedImages, setSavedImages] = useState<{url: string, title: string}[]>([]);
  const [imageTitle, setImageTitle] = useState("");
  
  const { isGenerating, generatedImageUrl, error, generateImage, retryCount } = useDesignImageGeneration();

  const styleOptions = [
    { value: "ui-design", label: "UI Design" },
    { value: "color-palette", label: "Color Scheme" },
    { value: "typography", label: "Typography" },
    { value: "layout", label: "Layout" },
    { value: "illustration", label: "Illustration" }
  ];

  const handleGenerate = async () => {
    const result = await generateImage(
      styleType, 
      description, 
      styleKeywords
    );
    
    if (result) {
      setActiveTab("preview");
      setImageTitle(description.slice(0, 30) + (description.length > 30 ? "..." : ""));
    }
  };

  const handleSave = () => {
    if (generatedImageUrl) {
      const newImage = {
        url: generatedImageUrl,
        title: imageTitle || `Style Reference ${savedImages.length + 1}`
      };
      
      setSavedImages([...savedImages, newImage]);
      toast.success("Style reference image saved!");
      setActiveTab("gallery");
    }
  };

  const downloadImage = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${filename.replace(/[^\w\s]/gi, '')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
      
      toast.success("Image downloaded successfully");
    } catch (err) {
      toast.error("Failed to download image");
      console.error("Download error:", err);
    }
  };

  return (
    <div className={className}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Image className="h-4 w-4" />
            Generate Style Reference
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Visual Style Guide Generator</DialogTitle>
            <DialogDescription>
              Create high-quality reference images to guide your design vision
            </DialogDescription>
          </DialogHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="create">Create</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="gallery">Saved ({savedImages.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="create" className="space-y-4 pt-4">
              <div className="grid gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="style-type" className="text-right">
                    Style Type
                  </Label>
                  <div className="col-span-3">
                    <select
                      id="style-type"
                      value={styleType}
                      onChange={(e) => setStyleType(e.target.value)}
                      className="w-full rounded-md border border-input px-3 py-2 bg-background"
                    >
                      {styleOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="reference-description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="reference-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="col-span-3"
                    rows={4}
                    placeholder="Describe in detail the visual style you want to create..."
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="style-keywords" className="text-right">
                    Style Keywords
                  </Label>
                  <Input
                    id="style-keywords"
                    value={styleKeywords}
                    onChange={(e) => setStyleKeywords(e.target.value)}
                    className="col-span-3"
                    placeholder="modern, clean, professional, photorealistic, detailed, etc."
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
                  {isGenerating && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                  {isGenerating ? "Generating..." : "Generate Reference Image"}
                </Button>
              </DialogFooter>
            </TabsContent>
            
            <TabsContent value="preview" className="space-y-4 pt-4">
              <div className="grid gap-4">
                <Label htmlFor="image-title">Image Title</Label>
                <Input
                  id="image-title"
                  value={imageTitle}
                  onChange={(e) => setImageTitle(e.target.value)}
                  placeholder="Give this reference image a name"
                />
              </div>
              
              <div className="bg-muted rounded-md overflow-hidden">
                {generatedImageUrl ? (
                  <img 
                    src={generatedImageUrl} 
                    alt="Generated style reference" 
                    className="w-full h-auto object-contain max-h-[500px]"
                  />
                ) : (
                  <div className="flex items-center justify-center h-[300px]">
                    <p className="text-muted-foreground">No image generated yet</p>
                  </div>
                )}
              </div>
              
              <DialogFooter className="gap-2 flex-col sm:flex-row sm:justify-end">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setActiveTab("create")}
                >
                  Back to Editor
                </Button>
                <Button 
                  type="button" 
                  onClick={handleSave}
                  disabled={!generatedImageUrl}
                >
                  Save to Gallery
                </Button>
              </DialogFooter>
            </TabsContent>
            
            <TabsContent value="gallery" className="pt-4">
              {savedImages.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedImages.map((image, index) => (
                    <Card key={index} className="overflow-hidden">
                      <div className="aspect-video relative">
                        <img
                          src={image.url}
                          alt={image.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium truncate">{image.title}</h3>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => downloadImage(image.url, image.title)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No saved reference images yet</p>
                  <Button variant="outline" onClick={() => setActiveTab("create")}>
                    Create your first reference image
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
