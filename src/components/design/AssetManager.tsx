
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { BarChart, Image as ImageIcon, Info, FileText, AlertCircle, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DesignSystemService, Asset, AssetAnalysis } from '@/services/design-system/design-system-service';

interface AssetManagerProps {
  projectId: string;
  wireframeId?: string;
}

export function AssetManager({ projectId, wireframeId }: AssetManagerProps) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [assetAnalysis, setAssetAnalysis] = useState<AssetAnalysis | null>(null);
  const [assetFilter, setAssetFilter] = useState<string>('all');
  
  useEffect(() => {
    if (projectId) {
      loadAssets();
    }
  }, [projectId]);
  
  const loadAssets = async () => {
    setIsLoading(true);
    try {
      const data = await DesignSystemService.getAssets(projectId);
      setAssets(data);
    } catch (error) {
      toast.error("Failed to load assets");
      console.error("Error loading assets:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAssetUsage = async (assetId: string) => {
    if (!wireframeId) return;
    
    try {
      await DesignSystemService.trackAssetUsage(assetId, wireframeId);
      toast.success("Asset usage recorded");
    } catch (error) {
      // Silently fail, already logged in the service
    }
  };
  
  const analyzeAssets = async () => {
    setIsAnalyzing(true);
    try {
      const analysis = await DesignSystemService.analyzeAssetUsage(projectId);
      setAssetAnalysis(analysis);
    } catch (error) {
      toast.error("Failed to analyze assets");
      console.error("Error analyzing assets:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="h-4 w-4" />;
      case 'icon':
        return <Info className="h-4 w-4" />;
      case 'font':
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Asset Manager</CardTitle>
        <CardDescription>
          Manage and optimize design assets across your project
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="assets" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="assets">Assets Library</TabsTrigger>
            <TabsTrigger value="analysis">Optimization</TabsTrigger>
          </TabsList>
          
          <TabsContent value="assets" className="space-y-4 py-2">
            <div className="flex items-center justify-between mb-4">
              <Select 
                value={assetFilter} 
                onValueChange={setAssetFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter assets" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Assets</SelectItem>
                  <SelectItem value="image">Images</SelectItem>
                  <SelectItem value="icon">Icons</SelectItem>
                  <SelectItem value="illustration">Illustrations</SelectItem>
                  <SelectItem value="animation">Animations</SelectItem>
                  <SelectItem value="font">Fonts</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                size="sm" 
                variant="outline" 
                onClick={loadAssets} 
                disabled={isLoading}
              >
                Refresh
              </Button>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center py-8">
                <p>Loading assets...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {assets
                  .filter(asset => assetFilter === 'all' || asset.asset_type === assetFilter)
                  .map((asset) => (
                    <Card key={asset.id} className="overflow-hidden">
                      {asset.asset_type === 'image' && (
                        <div className="h-32 bg-muted flex items-center justify-center overflow-hidden">
                          <img 
                            src={asset.file_path} 
                            alt={asset.name} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                      )}
                      
                      {asset.asset_type !== 'image' && (
                        <div className="h-32 bg-muted flex items-center justify-center">
                          {getAssetIcon(asset.asset_type)}
                          <span className="ml-2">{asset.format}</span>
                        </div>
                      )}
                      
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-sm truncate">{asset.name}</h3>
                          <Badge variant="outline">
                            {getAssetIcon(asset.asset_type)}
                            <span className="ml-1">{asset.asset_type}</span>
                          </Badge>
                        </div>
                        
                        <div className="text-xs text-muted-foreground">
                          <p>{(asset.file_size / 1024).toFixed(2)} KB</p>
                          <p className="truncate">Tags: {asset.tags.join(', ') || 'None'}</p>
                        </div>
                      </CardContent>
                      
                      <CardFooter className="p-4 pt-0 flex justify-end">
                        {wireframeId && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleAssetUsage(asset.id)}
                          >
                            Use Asset
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
                
                {assets.filter(asset => assetFilter === 'all' || asset.asset_type === assetFilter).length === 0 && (
                  <div className="col-span-full text-center py-8 text-muted-foreground">
                    No assets found in this category
                  </div>
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="analysis">
            <div className="py-4 space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Asset Optimization Analysis</h3>
                <Button 
                  onClick={analyzeAssets} 
                  disabled={isAnalyzing}
                  size="sm"
                >
                  <BarChart className="h-4 w-4 mr-2" />
                  {isAnalyzing ? 'Analyzing...' : 'Analyze Assets'}
                </Button>
              </div>
              
              {assetAnalysis ? (
                <div className="space-y-6">
                  {assetAnalysis.optimizationSuggestions.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center">
                          <AlertCircle className="h-4 w-4 mr-2" />
                          Optimization Suggestions
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Asset</TableHead>
                              <TableHead>Current Size</TableHead>
                              <TableHead>Suggestion</TableHead>
                              <TableHead>Potential Savings</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {assetAnalysis.optimizationSuggestions.map((suggestion) => (
                              <TableRow key={suggestion.id}>
                                <TableCell className="font-medium">{suggestion.name}</TableCell>
                                <TableCell>{(suggestion.currentSize / 1024).toFixed(2)} KB</TableCell>
                                <TableCell>{suggestion.suggestion}</TableCell>
                                <TableCell>
                                  {suggestion.potentialSavings > 0 ? 
                                    `${(suggestion.potentialSavings / 1024).toFixed(2)} KB (${Math.round((suggestion.potentialSavings / suggestion.currentSize) * 100)}%)` :
                                    '-'
                                  }
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  )}
                  
                  {assetAnalysis.unusedAssets && assetAnalysis.unusedAssets.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          Unused Assets
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Asset</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Size</TableHead>
                              <TableHead>Last Updated</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {assetAnalysis.unusedAssets.map((asset) => (
                              <TableRow key={asset.id}>
                                <TableCell className="font-medium">{asset.name}</TableCell>
                                <TableCell>{asset.type}</TableCell>
                                <TableCell>{(asset.size / 1024).toFixed(2)} KB</TableCell>
                                <TableCell>{new Date(asset.lastUpdated).toLocaleDateString()}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Click "Analyze Assets" to get optimization recommendations
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
