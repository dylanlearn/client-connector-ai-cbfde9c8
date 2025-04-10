
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
import { Switch } from '@/components/ui/switch';
import { getSuggestion } from '@/utils/copy-suggestions-helper';

interface NavigationSectionEditorProps {
  section: WireframeSection;
  onUpdate: (updates: Partial<WireframeSection>) => void;
}

interface NavItem {
  id: string;
  text: string;
  url: string;
  isActive?: boolean;
  children?: NavItem[];
  hasChildren?: boolean;
}

const NavigationSectionEditor: React.FC<NavigationSectionEditorProps> = ({ section, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('content');
  
  // Get data from section or use defaults
  const backgroundColor = section.backgroundColor || section.style?.backgroundColor || '#ffffff';
  const logoText = section.data?.logoText || getSuggestion(section.copySuggestions, 'logoText', 'Brand Name');
  const logoUrl = section.data?.logoUrl || '';
  
  // Initialize nav items
  const initialNavItems = section.data?.navItems || [];
  const [navItems, setNavItems] = useState<NavItem[]>(initialNavItems.length ? initialNavItems : [
    { id: 'nav-1', text: 'Home', url: '#', isActive: true },
    { id: 'nav-2', text: 'Features', url: '#features' },
    { id: 'nav-3', text: 'Pricing', url: '#pricing' },
    { id: 'nav-4', text: 'About', url: '#about' },
    { id: 'nav-5', text: 'Contact', url: '#contact' }
  ]);
  
  const navType = section.data?.navType || section.componentVariant || 'horizontal';
  const hasCta = section.data?.hasCta !== undefined ? section.data.hasCta : true;
  const ctaText = section.data?.ctaText || getSuggestion(section.copySuggestions, 'ctaText', 'Get Started');
  const ctaUrl = section.data?.ctaUrl || '#';
  const isSticky = section.data?.isSticky !== undefined ? section.data.isSticky : false;
  
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
  
  // Nav item management
  const addNavItem = () => {
    const newNavItem = {
      id: `nav-${Date.now()}`,
      text: 'New Item',
      url: '#',
      isActive: false
    };
    
    const updatedNavItems = [...navItems, newNavItem];
    setNavItems(updatedNavItems);
    handleContentChange('navItems', updatedNavItems);
  };
  
  const updateNavItem = (id: string, field: string, value: any) => {
    const updatedNavItems = navItems.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    });
    
    setNavItems(updatedNavItems);
    handleContentChange('navItems', updatedNavItems);
  };
  
  const deleteNavItem = (id: string) => {
    const updatedNavItems = navItems.filter(item => item.id !== id);
    setNavItems(updatedNavItems);
    handleContentChange('navItems', updatedNavItems);
  };
  
  const moveNavItem = (id: string, direction: 'up' | 'down') => {
    const index = navItems.findIndex(item => item.id === id);
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === navItems.length - 1)
    ) {
      return;
    }
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const updatedNavItems = [...navItems];
    const [removed] = updatedNavItems.splice(index, 1);
    updatedNavItems.splice(newIndex, 0, removed);
    
    setNavItems(updatedNavItems);
    handleContentChange('navItems', updatedNavItems);
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="navigation">Navigation Items</TabsTrigger>
          <TabsTrigger value="style">Style</TabsTrigger>
        </TabsList>
        
        <TabsContent value="content" className="space-y-4 pt-4">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="logoText">Logo Text</Label>
                <Input
                  id="logoText"
                  value={logoText}
                  onChange={(e) => handleContentChange('logoText', e.target.value)}
                  placeholder="Brand Name"
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
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="navType">Navigation Type</Label>
              <Select 
                value={navType} 
                onValueChange={(value) => {
                  handleContentChange('navType', value);
                  onUpdate({ componentVariant: value });
                }}
              >
                <SelectTrigger id="navType">
                  <SelectValue placeholder="Horizontal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="horizontal">Horizontal</SelectItem>
                  <SelectItem value="vertical">Vertical</SelectItem>
                  <SelectItem value="centered">Centered Logo</SelectItem>
                  <SelectItem value="hamburger">Hamburger Menu</SelectItem>
                  <SelectItem value="dropdown">Dropdown Menu</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="isSticky">Sticky Navigation</Label>
                <Switch 
                  id="isSticky"
                  checked={isSticky}
                  onCheckedChange={(checked) => handleContentChange('isSticky', checked)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="hasCta">Include CTA Button</Label>
                <Switch 
                  id="hasCta"
                  checked={hasCta}
                  onCheckedChange={(checked) => handleContentChange('hasCta', checked)}
                />
              </div>
              
              {hasCta && (
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="ctaText">CTA Button Text</Label>
                    <Input
                      id="ctaText"
                      value={ctaText}
                      onChange={(e) => handleContentChange('ctaText', e.target.value)}
                      placeholder="Get Started"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="ctaUrl">CTA Button URL</Label>
                    <Input
                      id="ctaUrl"
                      value={ctaUrl}
                      onChange={(e) => handleContentChange('ctaUrl', e.target.value)}
                      placeholder="#"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="navigation" className="space-y-4 pt-4">
          <div className="space-y-4">
            <Button onClick={addNavItem} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" /> Add Navigation Item
            </Button>
            
            <div className="space-y-4 mt-4">
              {navItems.length === 0 ? (
                <div className="text-center p-4 border border-dashed rounded-md text-muted-foreground">
                  No navigation items. Click the button above to add one.
                </div>
              ) : (
                navItems.map((item, index) => (
                  <Card key={item.id} className={`relative ${item.isActive ? 'border-primary' : ''}`}>
                    <CardContent className="pt-4 space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor={`text-${item.id}`}>Link Text</Label>
                          <Input
                            id={`text-${item.id}`}
                            value={item.text}
                            onChange={(e) => updateNavItem(item.id, 'text', e.target.value)}
                            placeholder="Home"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`url-${item.id}`}>Link URL</Label>
                          <Input
                            id={`url-${item.id}`}
                            value={item.url}
                            onChange={(e) => updateNavItem(item.id, 'url', e.target.value)}
                            placeholder="#"
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`isActive-${item.id}`} className="flex-grow">
                          Active Item
                        </Label>
                        <Switch 
                          id={`isActive-${item.id}`}
                          checked={item.isActive || false}
                          onCheckedChange={(checked) => updateNavItem(item.id, 'isActive', checked)}
                        />
                      </div>
                      
                      <div className="flex justify-between mt-2">
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => moveNavItem(item.id, 'up')}
                            disabled={index === 0}
                          >
                            <MoveUp className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => moveNavItem(item.id, 'down')}
                            disabled={index === navItems.length - 1}
                          >
                            <MoveDown className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button 
                          variant="destructive" 
                          size="icon" 
                          onClick={() => deleteNavItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
              <Label htmlFor="padding">Padding</Label>
              <Select 
                value={section.style?.padding || section.padding || '4'} 
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
            
            {/* Additional style options could be added here */}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NavigationSectionEditor;
