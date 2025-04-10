
import React, { useState } from 'react';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ColorPicker } from '@/components/ui/color-picker';
import { Plus, Trash2, MoveUp, MoveDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import RichTextEditor from './RichTextEditor';
import { getSuggestion } from '@/utils/copy-suggestions-helper';

interface FooterSectionEditorProps {
  section: WireframeSection;
  onUpdate: (updates: Partial<WireframeSection>) => void;
}

interface FooterColumn {
  id: string;
  title: string;
  links: Array<{
    id: string;
    text: string;
    url: string;
  }>;
}

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon?: string;
}

const FooterSectionEditor: React.FC<FooterSectionEditorProps> = ({ section, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('content');
  
  // Get data from section or use defaults
  const backgroundColor = section.backgroundColor || section.style?.backgroundColor || '#1f2937';
  const textColor = section.style?.color || section.style?.textColor || '#ffffff';
  const companyName = section.data?.companyName || getSuggestion(section.copySuggestions, 'companyName', 'Company Name');
  const logoUrl = section.data?.logoUrl || '';
  const copyright = section.data?.copyright || `© ${new Date().getFullYear()} ${companyName}. All rights reserved.`;
  const showSocialLinks = section.data?.showSocialLinks !== undefined ? section.data.showSocialLinks : true;
  
  // Initialize columns
  const initialColumns = section.data?.columns || [];
  const [columns, setColumns] = useState<FooterColumn[]>(initialColumns);
  
  // Initialize social links
  const initialSocialLinks = section.data?.socialLinks || [];
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(initialSocialLinks);
  
  const variant = section.data?.variant || section.componentVariant || 'standard';
  
  // Handle content updates
  const handleContentChange = (field: string, value: any) => {
    const updatedData = {
      ...(section.data || {}),
      [field]: value
    };
    onUpdate({ data: updatedData });
  };
  
  // Handle style updates
  const handleStyleChange = (field: string, value: any) => {
    const updatedStyle = {
      ...(section.style || {}),
      [field]: value
    };
    onUpdate({ style: updatedStyle, [field]: value });
  };
  
  // Column management
  const addColumn = () => {
    const newColumn = {
      id: `column-${Date.now()}`,
      title: 'Column Title',
      links: [
        { id: `link-${Date.now()}-1`, text: 'Link 1', url: '#' },
        { id: `link-${Date.now()}-2`, text: 'Link 2', url: '#' }
      ]
    };
    
    const updatedColumns = [...columns, newColumn];
    setColumns(updatedColumns);
    handleContentChange('columns', updatedColumns);
  };
  
  const updateColumn = (id: string, field: string, value: any) => {
    const updatedColumns = columns.map(column => {
      if (column.id === id) {
        return { ...column, [field]: value };
      }
      return column;
    });
    
    setColumns(updatedColumns);
    handleContentChange('columns', updatedColumns);
  };
  
  const deleteColumn = (id: string) => {
    const updatedColumns = columns.filter(column => column.id !== id);
    setColumns(updatedColumns);
    handleContentChange('columns', updatedColumns);
  };
  
  // Link management within a column
  const addLink = (columnId: string) => {
    const updatedColumns = columns.map(column => {
      if (column.id === columnId) {
        const newLink = {
          id: `link-${Date.now()}`,
          text: 'New Link',
          url: '#'
        };
        return {
          ...column,
          links: [...column.links, newLink]
        };
      }
      return column;
    });
    
    setColumns(updatedColumns);
    handleContentChange('columns', updatedColumns);
  };
  
  const updateLink = (columnId: string, linkId: string, field: string, value: string) => {
    const updatedColumns = columns.map(column => {
      if (column.id === columnId) {
        const updatedLinks = column.links.map(link => {
          if (link.id === linkId) {
            return { ...link, [field]: value };
          }
          return link;
        });
        return { ...column, links: updatedLinks };
      }
      return column;
    });
    
    setColumns(updatedColumns);
    handleContentChange('columns', updatedColumns);
  };
  
  const deleteLink = (columnId: string, linkId: string) => {
    const updatedColumns = columns.map(column => {
      if (column.id === columnId) {
        return {
          ...column,
          links: column.links.filter(link => link.id !== linkId)
        };
      }
      return column;
    });
    
    setColumns(updatedColumns);
    handleContentChange('columns', updatedColumns);
  };
  
  // Social link management
  const addSocialLink = () => {
    const newSocialLink = {
      id: `social-${Date.now()}`,
      platform: 'Twitter',
      url: '#',
      icon: 'twitter'
    };
    
    const updatedSocialLinks = [...socialLinks, newSocialLink];
    setSocialLinks(updatedSocialLinks);
    handleContentChange('socialLinks', updatedSocialLinks);
  };
  
  const updateSocialLink = (id: string, field: string, value: string) => {
    const updatedSocialLinks = socialLinks.map(link => {
      if (link.id === id) {
        return { ...link, [field]: value };
      }
      return link;
    });
    
    setSocialLinks(updatedSocialLinks);
    handleContentChange('socialLinks', updatedSocialLinks);
  };
  
  const deleteSocialLink = (id: string) => {
    const updatedSocialLinks = socialLinks.filter(link => link.id !== id);
    setSocialLinks(updatedSocialLinks);
    handleContentChange('socialLinks', updatedSocialLinks);
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="columns">Columns</TabsTrigger>
          <TabsTrigger value="style">Style</TabsTrigger>
        </TabsList>
        
        <TabsContent value="content" className="space-y-4 pt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={companyName}
                onChange={(e) => handleContentChange('companyName', e.target.value)}
                placeholder="Company Name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="logoUrl">Logo URL (optional)</Label>
              <Input
                id="logoUrl"
                value={logoUrl}
                onChange={(e) => handleContentChange('logoUrl', e.target.value)}
                placeholder="https://example.com/logo.png"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="copyright">Copyright Text</Label>
              <Input
                id="copyright"
                value={copyright}
                onChange={(e) => handleContentChange('copyright', e.target.value)}
                placeholder="© 2023 Company Name. All rights reserved."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="variant">Footer Variant</Label>
              <Select 
                value={variant} 
                onValueChange={(value) => {
                  handleContentChange('variant', value);
                  onUpdate({ componentVariant: value });
                }}
              >
                <SelectTrigger id="variant">
                  <SelectValue placeholder="Standard" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="simple">Simple</SelectItem>
                  <SelectItem value="centered">Centered</SelectItem>
                  <SelectItem value="multicolumn">Multi-column</SelectItem>
                  <SelectItem value="minimal">Minimal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="showSocialLinks">Show Social Links</Label>
                <Switch 
                  id="showSocialLinks"
                  checked={showSocialLinks}
                  onCheckedChange={(checked) => handleContentChange('showSocialLinks', checked)}
                />
              </div>
              
              {showSocialLinks && (
                <div className="mt-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium">Social Media Links</h3>
                    <Button onClick={addSocialLink} variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" /> Add Social Link
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {socialLinks.length === 0 ? (
                      <div className="text-center p-4 border border-dashed rounded-md text-muted-foreground">
                        No social links. Click the button above to add one.
                      </div>
                    ) : (
                      socialLinks.map((link) => (
                        <div key={link.id} className="flex items-center space-x-2 pb-2">
                          <Input
                            value={link.platform}
                            onChange={(e) => updateSocialLink(link.id, 'platform', e.target.value)}
                            placeholder="Platform name"
                            className="w-1/3"
                          />
                          <Input
                            value={link.url}
                            onChange={(e) => updateSocialLink(link.id, 'url', e.target.value)}
                            placeholder="URL"
                            className="flex-grow"
                          />
                          <Input
                            value={link.icon || ''}
                            onChange={(e) => updateSocialLink(link.id, 'icon', e.target.value)}
                            placeholder="Icon name"
                            className="w-1/4"
                          />
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => deleteSocialLink(link.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="columns" className="space-y-4 pt-4">
          <div className="space-y-4">
            <Button onClick={addColumn} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" /> Add Column
            </Button>
            
            <div className="space-y-4 mt-4">
              {columns.length === 0 ? (
                <div className="text-center p-4 border border-dashed rounded-md text-muted-foreground">
                  No columns. Click the button above to add one.
                </div>
              ) : (
                columns.map((column) => (
                  <Card key={column.id} className="relative">
                    <CardContent className="pt-4 space-y-4">
                      <div className="flex justify-between">
                        <div className="space-y-2 flex-grow">
                          <Label htmlFor={`title-${column.id}`}>Column Title</Label>
                          <Input
                            id={`title-${column.id}`}
                            value={column.title}
                            onChange={(e) => updateColumn(column.id, 'title', e.target.value)}
                            placeholder="Column Title"
                          />
                        </div>
                        <Button 
                          variant="destructive" 
                          size="icon" 
                          onClick={() => deleteColumn(column.id)}
                          className="ml-2 mt-7"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label>Links</Label>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => addLink(column.id)}
                          >
                            <Plus className="h-3 w-3 mr-1" /> Add Link
                          </Button>
                        </div>
                        
                        <div className="space-y-2 pl-2">
                          {column.links.length === 0 ? (
                            <div className="text-center p-2 text-sm text-muted-foreground">
                              No links. Click Add to add one.
                            </div>
                          ) : (
                            column.links.map((link) => (
                              <div key={link.id} className="flex items-center space-x-2 pb-2">
                                <Input
                                  value={link.text}
                                  onChange={(e) => updateLink(column.id, link.id, 'text', e.target.value)}
                                  placeholder="Link text"
                                  className="w-1/2"
                                />
                                <Input
                                  value={link.url}
                                  onChange={(e) => updateLink(column.id, link.id, 'url', e.target.value)}
                                  placeholder="URL"
                                  className="flex-grow"
                                />
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => deleteLink(column.id, link.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="style" className="space-y-4 pt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="backgroundColor">Background Color</Label>
              <div className="flex items-center space-x-2">
                <ColorPicker
                  id="backgroundColor"
                  color={backgroundColor}
                  onChange={(color) => handleStyleChange('backgroundColor', color)}
                />
                <Input
                  value={backgroundColor}
                  onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                  className="w-32"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="textColor">Text Color</Label>
              <div className="flex items-center space-x-2">
                <ColorPicker
                  id="textColor"
                  color={textColor}
                  onChange={(color) => handleStyleChange('color', color)}
                />
                <Input
                  value={textColor}
                  onChange={(e) => handleStyleChange('color', e.target.value)}
                  className="w-32"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="padding">Padding</Label>
              <Select 
                value={section.style?.padding || section.padding || '6'} 
                onValueChange={(value) => handleStyleChange('padding', value)}
              >
                <SelectTrigger id="padding">
                  <SelectValue placeholder="Large (24px)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">None (0px)</SelectItem>
                  <SelectItem value="2">Small (8px)</SelectItem>
                  <SelectItem value="4">Medium (16px)</SelectItem>
                  <SelectItem value="6">Large (24px)</SelectItem>
                  <SelectItem value="8">Extra Large (32px)</SelectItem>
                  <SelectItem value="12">XXL (48px)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Additional style options could be added here */}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FooterSectionEditor;
