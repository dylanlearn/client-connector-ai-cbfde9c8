
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Palette, Type, Maximize, Box, Clock, Square, Layers, Sigma } from "lucide-react";
import { DesignSystemService, DesignToken } from '@/services/design-system/design-system-service';

interface DesignTokenManagerProps {
  projectId: string;
  onTokensUpdate?: () => void;
}

const TOKEN_CATEGORIES = [
  { value: 'color', label: 'Color', icon: <Palette className="h-4 w-4" /> },
  { value: 'typography', label: 'Typography', icon: <Type className="h-4 w-4" /> },
  { value: 'spacing', label: 'Spacing', icon: <Maximize className="h-4 w-4" /> },
  { value: 'sizing', label: 'Sizing', icon: <Box className="h-4 w-4" /> },
  { value: 'shadow', label: 'Shadow', icon: <Square className="h-4 w-4" /> },
  { value: 'motion', label: 'Motion', icon: <Clock className="h-4 w-4" /> },
  { value: 'border', label: 'Border', icon: <Square className="h-4 w-4" /> },
  { value: 'opacity', label: 'Opacity', icon: <Layers className="h-4 w-4" /> },
  { value: 'z-index', label: 'Z-Index', icon: <Layers className="h-4 w-4" /> },
  { value: 'other', label: 'Other', icon: <Sigma className="h-4 w-4" /> }
];

export function DesignTokenManager({ projectId, onTokensUpdate }: DesignTokenManagerProps) {
  const [tokens, setTokens] = useState<DesignToken[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('color');
  const [newToken, setNewToken] = useState({
    name: '',
    category: 'color',
    value: '',
    description: ''
  });
  const [currentTab, setCurrentTab] = useState<string>('browse');
  
  useEffect(() => {
    if (projectId) {
      loadTokens();
    }
  }, [projectId]);
  
  const loadTokens = async () => {
    setIsLoading(true);
    try {
      const data = await DesignSystemService.getDesignTokens(projectId);
      setTokens(data);
    } catch (error) {
      toast.error("Failed to load design tokens");
      console.error("Error loading tokens:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCreateToken = async () => {
    if (!newToken.name || !newToken.value) {
      toast.error("Name and value are required");
      return;
    }
    
    try {
      setIsLoading(true);
      
      let parsedValue = newToken.value;
      // Try to parse if it looks like JSON
      if (newToken.value.startsWith('{') || newToken.value.startsWith('[')) {
        try {
          parsedValue = JSON.parse(newToken.value);
        } catch (e) {
          // If it fails, use as string
        }
      }
      
      await DesignSystemService.createDesignToken({
        project_id: projectId,
        name: newToken.name,
        category: newToken.category as any,
        value: parsedValue,
        description: newToken.description
      });
      
      toast.success("Design token created successfully");
      setNewToken({
        name: '',
        category: 'color',
        value: '',
        description: ''
      });
      loadTokens();
      if (onTokensUpdate) onTokensUpdate();
      setCurrentTab('browse');
    } catch (error) {
      toast.error("Failed to create design token");
      console.error("Error creating token:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteToken = async (tokenId: string) => {
    if (confirm("Are you sure you want to delete this token?")) {
      setIsLoading(true);
      try {
        await DesignSystemService.deleteDesignToken(tokenId);
        toast.success("Design token deleted successfully");
        loadTokens();
        if (onTokensUpdate) onTokensUpdate();
      } catch (error) {
        toast.error("Failed to delete design token");
        console.error("Error deleting token:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  const renderTokenValue = (token: DesignToken) => {
    if (token.category === 'color') {
      return (
        <div className="flex items-center space-x-2">
          <div 
            className="w-6 h-6 rounded-full border border-gray-200" 
            style={{ backgroundColor: typeof token.value === 'string' ? token.value : JSON.stringify(token.value) }}
          />
          <span className="text-xs">{typeof token.value === 'string' ? token.value : JSON.stringify(token.value)}</span>
        </div>
      );
    }
    
    if (typeof token.value === 'object') {
      return <span className="text-xs">{JSON.stringify(token.value)}</span>;
    }
    
    return <span>{token.value}</span>;
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Design Token Manager</CardTitle>
        <CardDescription>
          Manage design tokens for colors, typography, spacing, and more
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs 
          defaultValue="browse" 
          value={currentTab} 
          onValueChange={setCurrentTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="browse">Browse Tokens</TabsTrigger>
            <TabsTrigger value="create">Create Token</TabsTrigger>
          </TabsList>
          
          <TabsContent value="browse" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <Select 
                value={selectedCategory} 
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {TOKEN_CATEGORIES.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      <div className="flex items-center">
                        {category.icon}
                        <span className="ml-2">{category.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button 
                size="sm" 
                variant="outline" 
                onClick={loadTokens} 
                disabled={isLoading}
              >
                Refresh
              </Button>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center py-8">
                <p>Loading tokens...</p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tokens
                      .filter(token => selectedCategory === 'all' || token.category === selectedCategory)
                      .map((token) => (
                        <TableRow key={token.id}>
                          <TableCell className="font-medium">{token.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {TOKEN_CATEGORIES.find(cat => cat.value === token.category)?.icon}
                              <span className="ml-1">{token.category}</span>
                            </Badge>
                          </TableCell>
                          <TableCell>{renderTokenValue(token)}</TableCell>
                          <TableCell>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleDeleteToken(token.id)}
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    
                    {tokens.filter(token => selectedCategory === 'all' || token.category === selectedCategory).length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4">
                          No tokens found in this category
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="create" className="space-y-4 py-2">
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Token Name</Label>
                  <Input 
                    id="name" 
                    value={newToken.name}
                    onChange={(e) => setNewToken({...newToken, name: e.target.value})}
                    placeholder="e.g., primary-color"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={newToken.category} 
                    onValueChange={(value) => setNewToken({...newToken, category: value})}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {TOKEN_CATEGORIES.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          <div className="flex items-center">
                            {category.icon}
                            <span className="ml-2">{category.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="value">Value</Label>
                {newToken.category === 'color' ? (
                  <div className="flex space-x-2">
                    <Input 
                      type="color"
                      className="w-12" 
                      value={newToken.value} 
                      onChange={(e) => setNewToken({...newToken, value: e.target.value})}
                    />
                    <Input 
                      className="flex-1"
                      value={newToken.value}
                      onChange={(e) => setNewToken({...newToken, value: e.target.value})}
                      placeholder="#FFFFFF or rgb(255, 255, 255)"
                    />
                  </div>
                ) : (
                  <Input 
                    id="value" 
                    value={newToken.value}
                    onChange={(e) => setNewToken({...newToken, value: e.target.value})}
                    placeholder="Value or JSON for complex tokens"
                  />
                )}
                <p className="text-xs text-muted-foreground">
                  For simple tokens, enter a single value. For complex tokens, enter a valid JSON object.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input 
                  id="description" 
                  value={newToken.description}
                  onChange={(e) => setNewToken({...newToken, description: e.target.value})}
                  placeholder="Optional description of the token"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-end">
        {currentTab === 'create' && (
          <Button onClick={handleCreateToken} disabled={isLoading || !newToken.name || !newToken.value}>
            {isLoading ? 'Creating...' : 'Create Token'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
