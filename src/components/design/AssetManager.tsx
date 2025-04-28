
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Download, BarChart2, FileImage, FileText, FileCode } from 'lucide-react';
import { DesignSystemService, DesignAsset } from '@/services/design-system/design-system-service';

interface AssetManagerProps {
  projectId: string;
  wireframeId: string;
}

export function AssetManager({ projectId, wireframeId }: AssetManagerProps) {
  const [assets, setAssets] = useState<DesignAsset[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [usageAnalysis, setUsageAnalysis] = useState<any>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  
  useEffect(() => {
    if (projectId) {
      loadAssets();
    }
  }, [projectId]);
  
  const loadAssets = async () => {
    setIsLoading(true);
    try {
      const data = await DesignSystemService.getDesignAssets(projectId);
      setAssets(data);
    } catch (error) {
      console.error('Error fetching design assets:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const analyzeAssetUsage = async () => {
    setIsLoading(true);
    setShowAnalysis(false);
    try {
      const analysis = await DesignSystemService.analyzeAssetUsage(projectId);
      setUsageAnalysis(analysis);
      setShowAnalysis(true);
    } catch (error) {
      console.error('Error analyzing asset usage:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const getAssetTypeIcon = (assetType: string) => {
    switch (assetType.toLowerCase()) {
      case 'image':
        return <FileImage className="h-4 w-4" />;
      case 'document':
        return <FileText className="h-4 w-4" />;
      case 'code':
        return <FileCode className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };
  
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Asset Management
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={loadAssets}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={analyzeAssetUsage}
              disabled={isLoading}
            >
              <BarChart2 className="h-4 w-4 mr-2" />
              Analyze Usage
            </Button>
          </div>
        </CardTitle>
        <CardDescription>
          Manage your design assets and track their usage across wireframes
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {showAnalysis && usageAnalysis && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Asset Analysis Results</CardTitle>
              <CardDescription>
                Analysis completed on {new Date(usageAnalysis.analyzedAt).toLocaleString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {usageAnalysis.unusedAssets?.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-2">Unused Assets ({usageAnalysis.unusedAssets.length})</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {usageAnalysis.unusedAssets.map((asset: any) => (
                        <li key={asset.id}>
                          {asset.name} ({formatFileSize(asset.size)})
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {usageAnalysis.duplicateAssets?.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-2">Potential Duplicate Assets ({usageAnalysis.duplicateAssets.length})</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {usageAnalysis.duplicateAssets.map((group: any, index: number) => (
                        <li key={index}>
                          {group.count} files named "{group.name}" ({group.type})
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {usageAnalysis.optimizationSuggestions?.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-2">Optimization Opportunities ({usageAnalysis.optimizationSuggestions.length})</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {usageAnalysis.optimizationSuggestions.map((suggestion: any) => (
                        <li key={suggestion.id}>
                          {suggestion.name}: {suggestion.suggestion} 
                          {suggestion.potentialSavings > 0 && (
                            <span className="text-green-600"> (save ~{formatFileSize(suggestion.potentialSavings)})</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {usageAnalysis.unusedAssets?.length === 0 && 
                 usageAnalysis.duplicateAssets?.length === 0 && 
                 usageAnalysis.optimizationSuggestions?.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    No issues found! Your assets are well optimized.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : assets.length > 0 ? (
          <Table>
            <TableCaption>List of design assets for this project</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Format</TableHead>
                <TableHead>Size</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assets.map(asset => (
                <TableRow key={asset.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      {getAssetTypeIcon(asset.asset_type)}
                      <span className="ml-2">{asset.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{asset.asset_type}</Badge>
                  </TableCell>
                  <TableCell>{asset.format}</TableCell>
                  <TableCell>{formatFileSize(asset.file_size)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                      <span className="sr-only">Download</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No assets found for this project
          </div>
        )}
      </CardContent>
    </Card>
  );
}
