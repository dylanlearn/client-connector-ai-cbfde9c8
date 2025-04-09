
import React from 'react';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface NavigationSectionEditorProps {
  section: WireframeSection;
  onUpdate: (updates: Partial<WireframeSection>) => void;
}

const NavigationSectionEditor: React.FC<NavigationSectionEditorProps> = ({ section, onUpdate }) => {
  const updateData = (key: string, value: any) => {
    const updatedData = {
      ...(section.data || {}),
      [key]: value
    };
    onUpdate({ data: updatedData });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">Navigation Editor</h2>
      
      <div className="space-y-2">
        <Label htmlFor="nav-logo">Logo URL</Label>
        <Input
          id="nav-logo"
          value={section.data?.logo || ''}
          onChange={(e) => updateData('logo', e.target.value)}
          placeholder="/logo.svg"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="nav-cta">CTA Button Label</Label>
        <Input
          id="nav-cta"
          value={section.data?.ctaLabel || ''}
          onChange={(e) => updateData('ctaLabel', e.target.value)}
          placeholder="Get Started"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="nav-bg-style">Background Style</Label>
        <Select 
          value={section.data?.backgroundStyle || 'light'} 
          onValueChange={(value) => updateData('backgroundStyle', value)}
        >
          <SelectTrigger id="nav-bg-style">
            <SelectValue placeholder="Select background style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="transparent">Transparent</SelectItem>
            <SelectItem value="gradient">Gradient</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center space-x-2 pt-2">
        <Switch 
          id="nav-sticky" 
          checked={section.data?.sticky || false}
          onCheckedChange={(checked) => updateData('sticky', checked)}
        />
        <Label htmlFor="nav-sticky">Sticky Navigation</Label>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch 
          id="nav-search" 
          checked={section.data?.hasSearch || false}
          onCheckedChange={(checked) => updateData('hasSearch', checked)}
        />
        <Label htmlFor="nav-search">Include Search</Label>
      </div>
      
      <div className="bg-muted/50 p-4 rounded-md mt-4">
        <p className="text-sm text-muted-foreground">
          This editor supports basic navigation properties. 
          For advanced navigation links editing, please use the dedicated navigation menu editor.
        </p>
      </div>
    </div>
  );
};

export default NavigationSectionEditor;
