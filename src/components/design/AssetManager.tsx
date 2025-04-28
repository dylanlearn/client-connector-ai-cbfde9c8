
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageIcon, FileIcon, UploadCloud, RefreshCw, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { DesignSystemService, DesignAsset } from '@/services/design-system/design-system-service';
import { Badge } from '@/components/ui/badge';

interface AssetManagerProps {
  projectId: string;
  wireframeId: string;
}

export function AssetManager({ projectId, wireframeId }: AssetManagerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [assets, setAssets] = useState<DesignAsset[]>([]);
  const [assetUsage, setAssetUsage] = useState<Record<string, any>>({});
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('images');
  const { toast } = useToast();

  useEffect(() => {
    loadAssets();
  }, [projectId]);

  const loadAssets = async () => {
    try {
      setIsLoading(true);
      const data = await DesignSystemService.getDesignAssets(projectId);
      setAssets(data);
    } catch (error) {
      console.error('Error loading design assets:', error);
      toast({
        title: "Error",
        description: "Failed to load design assets",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssetAnalysis = async () => {
    try {
      setIsAnalyzing(true);
      const results = await DesignSystemService.analyzeAssetUsage(projectId);
      setAnalysisResults(results);
      toast({
        title: "Analysis Complete",
        description: "Asset usage analysis has been completed"
      });
    } catch (error) {
      console.error('Error analyzing assets:', error);
      toast({
        title: "Error",
        description: "Failed to analyze assets",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadAssetUsage = async (assetId: string) => {
    if (assetUsage[assetId]) return; // Already loaded
    
    try {
      const usage = await DesignSystemService.getAssetUsage(assetId);
      setAssetUsage(prev => ({
        ...prev,
        [assetId]: usage
      }));
    } catch (error) {
      console.error('Error loading asset usage:', error);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filterAssetsByType = (assetType: string) => {
    return assets.filter(asset => asset.asset_type === assetType);
  };

  const imageAssets = filterAssetsByType('image');
  const fontAssets = filterAssetsByType('font');
  const iconAssets = filterAssetsByType('icon');

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center">
          <ImageIcon className="h-5 w-5 mr-2" />
          Asset Manager
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={handleAssetAnalysis}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Analyze Usage
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent>
        {analysisResults && (
          <Card className="mb-6 bg-amber-50 border-amber-200">
            <CardContent className="p-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-amber-800">Asset Optimization Suggestions</h3>
                  <ul className="mt-2 space-y-2 text-sm">
                    {analysisResults.unusedAssets?.length > 0 && (
                      <li className="flex items-center">
                        <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full mr-2">
                          {analysisResults.unusedAssets.length} unused
                        </span>
                        <span>Assets not used in any wireframes</span>
                      </li>
                    )}
                    {analysisResults.duplicateAssets?.length > 0 && (
                      <li className="flex items-center">
                        <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full mr-2">
                          {analysisResults.duplicateAssets.length} duplicates
                        </span>
                        <span>Potentially duplicate assets detected</span>
                      </li>
                    )}
                    {analysisResults.optimizationSuggestions?.length > 0 && (
                      <li className="flex items-center">
                        <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full mr-2">
                          {analysisResults.optimizationSuggestions.length} suggestions
                        </span>
                        <span>Optimization opportunities found</span>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="images">
              <ImageIcon className="h-4 w-4 mr-2" /> Images
            </TabsTrigger>
            <TabsTrigger value="icons">
              <FileIcon className="h-4 w-4 mr-2" /> Icons
            </TabsTrigger>
            <TabsTrigger value="fonts">
              <FileIcon className="h-4 w-4 mr-2" /> Fonts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="images" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {imageAssets.length > 0 ? imageAssets.map(asset => (
                <Card key={asset.id} className="overflow-hidden">
                  <div 
                    className="h-32 bg-gray-100 bg-center bg-cover bg-no-repeat" 
                    style={{ backgroundImage: `url(${asset.file_path})` }}
                  />
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-medium truncate">{asset.name}</h3>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{formatFileSize(asset.file_size)}</span>
                      <span>{asset.format.toUpperCase()}</span>
                    </div>
                    
                    {asset.tags && asset.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {asset.tags.map((tag, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-3"
                      onClick={() => loadAssetUsage(asset.id)}
                    >
                      View Usage
                    </Button>
                    
                    {assetUsage[asset.id] && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        Used in {assetUsage[asset.id].length} wireframe(s)
                      </div>
                    )}
                  </CardContent>
                </Card>
              )) : (
                <div className="col-span-3 text-center py-10">
                  <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="mt-4 font-medium">No Images Found</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Upload images to use in your wireframes
                  </p>
                  <Button className="mt-4">
                    <UploadCloud className="h-4 w-4 mr-2" />
                    Upload Image
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="icons" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {iconAssets.length > 0 ? iconAssets.map(asset => (
                <Card key={asset.id} className="p-4">
                  <div className="flex flex-col items-center">
                    <div className="h-16 w-16 flex items-center justify-center">
                      <img 
                        src={asset.file_path} 
                        alt={asset.name} 
                        className="max-h-full max-w-full" 
                      />
                    </div>
                    <div className="mt-2 text-center">
                      <h3 className="text-sm font-medium truncate max-w-full">
                        {asset.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {asset.format.toUpperCase()}
                      </p>
                    </div>
                  </div>
                </Card>
              )) : (
                <div className="col-span-4 text-center py-10">
                  <FileIcon className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="mt-4 font-medium">No Icons Found</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Upload icons to use in your wireframes
                  </p>
                  <Button className="mt-4">
                    <UploadCloud className="h-4 w-4 mr-2" />
                    Upload Icon
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="fonts" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 gap-4">
              {fontAssets.length > 0 ? fontAssets.map(asset => (
                <Card key={asset.id} className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{asset.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(asset.file_size)} • {asset.format.toUpperCase()}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">View Details</Button>
                  </div>
                </Card>
              )) : (
                <div className="text-center py-10">
                  <FileIcon className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="mt-4 font-medium">No Fonts Found</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Upload custom fonts to use in your wireframes
                  </p>
                  <Button className="mt-4">
                    <UploadCloud className="h-4 w-4 mr-2" />
                    Upload Font
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
