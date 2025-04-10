
import React, { useState } from 'react';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ColorPicker } from '@/components/ui/color-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch'; // Added missing import
import RichTextEditor from './RichTextEditor';

interface FooterSectionEditorProps {
  section: WireframeSection;
  onUpdate: (updates: Partial<WireframeSection>) => void;
}

const FooterSectionEditor: React.FC<FooterSectionEditorProps> = ({ section, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('content');
  
  // Get data from section or use defaults
  const backgroundColor = section.backgroundColor || section.style?.backgroundColor || '#ffffff';
  const data = section.data || {};
  const style = section.style || {};
  
  // Handle content updates
  const handleContentChange = (field: string, value: any) => {
    const updatedData = {
      ...data,
      [field]: value
    };
    onUpdate({ data: updatedData });
  };
  
  // Handle style updates
  const handleStyleChange = (field: string, value: any) => {
    const updatedStyle = {
      ...style,
      [field]: value
    };
    onUpdate({ style: updatedStyle, [field]: value });
  };
  
  // Toggle boolean options
  const handleToggle = (field: string) => {
    const currentValue = data[field] === true;
    handleContentChange(field, !currentValue);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">Footer Editor</h2>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="links">Links</TabsTrigger>
          <TabsTrigger value="style">Style</TabsTrigger>
        </TabsList>
        
        <TabsContent value="content" className="space-y-4 pt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="logo">Logo URL</Label>
              <Input
                id="logo"
                value={data.logo || ''}
                onChange={(e) => handleContentChange('logo', e.target.value)}
                placeholder="Logo image URL"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={data.companyName || ''}
                onChange={(e) => handleContentChange('companyName', e.target.value)}
                placeholder="Company name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tagline">Tagline or Description</Label>
              <Input
                id="tagline"
                value={data.tagline || ''}
                onChange={(e) => handleContentChange('tagline', e.target.value)}
                placeholder="A short description of your company"
              />
            </div>
            
            <Card>
              <CardContent className="pt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="showSocialIcons">Show Social Icons</Label>
                  <Switch
                    id="showSocialIcons"
                    checked={data.showSocialIcons === true}
                    onCheckedChange={() => handleToggle('showSocialIcons')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="showLegalLinks">Show Legal Links</Label>
                  <Switch
                    id="showLegalLinks"
                    checked={data.showLegalLinks === true}
                    onCheckedChange={() => handleToggle('showLegalLinks')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="showNewsletter">Show Newsletter</Label>
                  <Switch
                    id="showNewsletter"
                    checked={data.showNewsletter === true}
                    onCheckedChange={() => handleToggle('showNewsletter')}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="links" className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Social Media Links</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="Twitter URL"
                value={data.twitter || ''}
                onChange={(e) => handleContentChange('twitter', e.target.value)}
              />
              <Input
                placeholder="Facebook URL"
                value={data.facebook || ''}
                onChange={(e) => handleContentChange('facebook', e.target.value)}
              />
              <Input
                placeholder="Instagram URL"
                value={data.instagram || ''}
                onChange={(e) => handleContentChange('instagram', e.target.value)}
              />
              <Input
                placeholder="LinkedIn URL"
                value={data.linkedin || ''}
                onChange={(e) => handleContentChange('linkedin', e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Legal Links</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="Privacy Policy URL"
                value={data.privacyPolicy || ''}
                onChange={(e) => handleContentChange('privacyPolicy', e.target.value)}
              />
              <Input
                placeholder="Terms of Service URL"
                value={data.termsOfService || ''}
                onChange={(e) => handleContentChange('termsOfService', e.target.value)}
              />
              <Input
                placeholder="Cookie Policy URL"
                value={data.cookiePolicy || ''}
                onChange={(e) => handleContentChange('cookiePolicy', e.target.value)}
              />
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
                  color={style.color || '#000000'}
                  onChange={(color) => handleStyleChange('color', color)}
                />
                <Input
                  value={style.color || '#000000'}
                  onChange={(e) => handleStyleChange('color', e.target.value)}
                  className="w-32"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="padding">Padding</Label>
              <Select 
                value={style.padding || '4'} 
                onValueChange={(value) => handleStyleChange('padding', value)}
              >
                <SelectTrigger id="padding">
                  <SelectValue placeholder="Medium (16px)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">None (0px)</SelectItem>
                  <SelectItem value="2">Small (8px)</SelectItem>
                  <SelectItem value="4">Medium (16px)</SelectItem>
                  <SelectItem value="6">Large (24px)</SelectItem>
                  <SelectItem value="8">Extra Large (32px)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="columns">Number of Columns</Label>
              <Select 
                value={data.columns?.toString() || '3'} 
                onValueChange={(value) => handleContentChange('columns', parseInt(value))}
              >
                <SelectTrigger id="columns">
                  <SelectValue placeholder="3 columns" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 column</SelectItem>
                  <SelectItem value="2">2 columns</SelectItem>
                  <SelectItem value="3">3 columns</SelectItem>
                  <SelectItem value="4">4 columns</SelectItem>
                  <SelectItem value="5">5 columns</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="alignment">Content Alignment</Label>
              <Select 
                value={data.alignment || 'center'} 
                onValueChange={(value) => handleContentChange('alignment', value)}
              >
                <SelectTrigger id="alignment">
                  <SelectValue placeholder="Center" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FooterSectionEditor;
