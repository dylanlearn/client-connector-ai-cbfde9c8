
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader2, Upload, Image, FileIcon, Lock, Eye, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AssetManagerProps {
  wireframeId: string;
}

export const AssetManager: React.FC<AssetManagerProps> = ({ wireframeId }) => {
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [assetName, setAssetName] = useState('');
  const [assetType, setAssetType] = useState<string>('image');
  const [assetTags, setAssetTags] = useState('');

  // Fetch assets 
  const { data: assets, isLoading } = useQuery({
    queryKey: ['design-assets', wireframeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('design_assets')
        .select('*')
        .eq('project_id', 'project-1') // Placeholder
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Upload asset
  const { mutate: uploadAsset, isPending: isUploading } = useMutation({
    mutationFn: async () => {
      if (!selectedFile) throw new Error("No file selected");
      
      // In a real implementation, you would first upload to Supabase storage
      // Then record the file details in the design_assets table
      
      // This is a simplified mock implementation
      const dimensions = assetType === 'image' ? { width: 800, height: 600 } : null;
      
      const { data, error } = await supabase
        .from('design_assets')
        .insert({
          project_id: 'project-1', // Placeholder
          name: assetName || selectedFile.name,
          file_path: `/assets/${selectedFile.name}`, // Mock path
          asset_type: assetType,
          file_size: selectedFile.size,
          dimensions: dimensions,
          format: selectedFile.name.split('.').pop() || '',
          tags: assetTags.split(',').map(tag => tag.trim()).filter(tag => tag),
        })
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['design-assets', wireframeId] });
      toast.success("Asset uploaded successfully");
      setSelectedFile(null);
      setAssetName('');
      setAssetTags('');
    },
    onError: (error) => {
      toast.error("Failed to upload asset", {
        description: error instanceof Error ? error.message : "Unknown error occurred"
      });
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      if (!assetName) {
        setAssetName(e.target.files[0].name.split('.')[0]);
      }
      
      // Detect asset type from file
      const fileType = e.target.files[0].type;
      if (fileType.startsWith('image/')) {
        setAssetType('image');
      } else if (fileType.startsWith('video/')) {
        setAssetType('video');
      } else if (fileType.startsWith('audio/')) {
        setAssetType('audio');
      } else if (fileType.includes('font')) {
        setAssetType('font');
      } else {
        setAssetType('other');
      }
    }
  };

  // Asset card component
  const AssetCard = ({ asset }: { asset: any }) => {
    const AssetIcon = () => {
      switch (asset.asset_type) {
        case 'image':
          return <Image className="h-5 w-5" />;
        default:
          return <FileIcon className="h-5 w-5" />;
      }
    };

    return (
      <div className="border rounded p-2 flex flex-col">
        <div className="bg-gray-100 h-24 flex items-center justify-center rounded">
          {asset.asset_type === 'image' ? (
            <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
              <AssetIcon />
            </div>
          ) : (
            <AssetIcon />
          )}
        </div>
        <div className="mt-2">
          <div className="text-sm font-medium truncate">{asset.name}</div>
          <div className="text-xs text-gray-500">{(asset.file_size / 1024).toFixed(1)} KB</div>
        </div>
        <div className="flex items-center justify-between mt-1">
          <div className="flex space-x-1">
            {asset.tags?.slice(0, 2).map((tag: string, index: number) => (
              <span key={index} className="text-xs bg-gray-100 px-1 rounded">{tag}</span>
            ))}
            {(asset.tags?.length || 0) > 2 && <span className="text-xs">+{asset.tags.length - 2}</span>}
          </div>
          <Button size="icon" variant="ghost" className="h-6 w-6">
            <Eye className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Asset Management</CardTitle>
        <CardDescription>
          Upload, manage and track usage of design assets
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="browse">
          <TabsList className="mb-4">
            <TabsTrigger value="browse">Browse Assets</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="usage">Usage Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="browse">
            {isLoading ? (
              <div className="flex items-center justify-center p-6">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <Label>Filter by type</Label>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="All types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All types</SelectItem>
                        <SelectItem value="image">Images</SelectItem>
                        <SelectItem value="icon">Icons</SelectItem>
                        <SelectItem value="illustration">Illustrations</SelectItem>
                        <SelectItem value="font">Fonts</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload New
                  </Button>
                </div>

                {assets && assets.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {assets.map((asset: any) => (
                      <AssetCard key={asset.id} asset={asset} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-6 text-gray-500">
                    No assets found
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="upload">
            <div className="space-y-4">
              <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                <Input 
                  type="file" 
                  id="asset-upload" 
                  className="hidden" 
                  onChange={handleFileChange} 
                />
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <Label htmlFor="asset-upload" className="cursor-pointer text-center">
                  <span className="text-primary font-medium">Click to upload</span> or drag and drop
                </Label>
                <div className="text-xs text-gray-500 mt-2">
                  SVG, PNG, JPG, GIF (max. 2MB)
                </div>
                {selectedFile && (
                  <div className="mt-3 text-sm font-medium">
                    Selected: {selectedFile.name}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="asset-name">Asset Name</Label>
                  <Input 
                    id="asset-name"
                    placeholder="Enter name for this asset"
                    value={assetName}
                    onChange={(e) => setAssetName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="asset-type">Asset Type</Label>
                  <Select value={assetType} onValueChange={setAssetType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select asset type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="icon">Icon</SelectItem>
                      <SelectItem value="illustration">Illustration</SelectItem>
                      <SelectItem value="animation">Animation</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="audio">Audio</SelectItem>
                      <SelectItem value="font">Font</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="asset-tags">Tags (comma separated)</Label>
                <Input 
                  id="asset-tags"
                  placeholder="e.g. logo, branding, hero"
                  value={assetTags}
                  onChange={(e) => setAssetTags(e.target.value)}
                />
              </div>

              <Button 
                onClick={() => uploadAsset()} 
                disabled={isUploading || !selectedFile}
                className="w-full"
              >
                {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isUploading ? "Uploading..." : "Upload Asset"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="usage">
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded">
                <h3 className="text-sm font-medium mb-2">Asset Usage Analytics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <div className="bg-white p-3 rounded shadow-sm">
                    <div className="text-xs text-gray-500">Total Assets</div>
                    <div className="text-xl font-semibold mt-1">{assets?.length || 0}</div>
                  </div>
                  <div className="bg-white p-3 rounded shadow-sm">
                    <div className="text-xs text-gray-500">Used in Wireframes</div>
                    <div className="text-xl font-semibold mt-1">0</div>
                  </div>
                  <div className="bg-white p-3 rounded shadow-sm">
                    <div className="text-xs text-gray-500">Unused Assets</div>
                    <div className="text-xl font-semibold mt-1">{assets?.length || 0}</div>
                  </div>
                  <div className="bg-white p-3 rounded shadow-sm">
                    <div className="text-xs text-gray-500">Size Optimization</div>
                    <div className="text-xl font-semibold mt-1">0%</div>
                  </div>
                </div>
              </div>

              <div className="border rounded-md overflow-hidden">
                <div className="bg-muted p-2 text-sm font-medium">
                  Optimization Recommendations
                </div>
                <div className="divide-y">
                  <div className="p-3 flex items-center justify-between">
                    <div className="flex items-center">
                      <Lock className="h-4 w-4 text-amber-500 mr-2" />
                      <div>
                        <div className="text-sm font-medium">Enable asset optimization</div>
                        <div className="text-xs text-gray-500">Automatically optimize images on upload</div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">Enable</Button>
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-8 p-4 border rounded-md">
                <Button variant="outline" className="flex gap-2">
                  <ThumbsUp className="h-4 w-4" />
                  <span>Is this analysis helpful?</span>
                </Button>
                <Button variant="outline" className="flex gap-2">
                  <ThumbsDown className="h-4 w-4" />
                  <span>Not helpful</span>
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
