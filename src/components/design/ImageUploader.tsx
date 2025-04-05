
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

interface ImageUploaderProps {
  onImageUploaded: (url: string, category: string) => void;
  category: string;
}

const ImageUploader = ({ onImageUploaded, category }: ImageUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const { user } = useAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    if (!user) {
      toast.error("You must be logged in to upload images");
      return;
    }

    setIsUploading(true);

    try {
      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${category}/${fileName}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('design_images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('design_images')
        .getPublicUrl(filePath);

      toast.success("Image uploaded successfully");
      onImageUploaded(publicUrlData.publicUrl, category);
      setFile(null);

      // Reset file input
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast.error(`Upload failed: ${error.message || "Unknown error"}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-2 p-4 border rounded-lg bg-muted/30">
      <Label htmlFor="file-upload">Upload New {category.charAt(0).toUpperCase() + category.slice(1)} Image</Label>
      <Input
        id="file-upload"
        type="file"
        onChange={handleFileChange}
        accept="image/*"
        disabled={isUploading}
      />
      <Button 
        onClick={handleUpload} 
        disabled={!file || isUploading}
        className="w-full"
      >
        {isUploading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </>
        )}
      </Button>
    </div>
  );
};

export default ImageUploader;
