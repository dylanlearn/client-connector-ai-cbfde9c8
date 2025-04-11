
import React, { useState } from 'react';
import { 
  FormItem,
  FormLabel,
  FormControl 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectItem 
} from '@/components/ui/select';
import { ChromePicker } from 'react-color';
import { Button } from '@/components/ui/button';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';

interface HeroSectionEditorProps {
  section: WireframeSection;
  onUpdate: (updates: Partial<WireframeSection>) => void;
}

const HeroSectionEditor: React.FC<HeroSectionEditorProps> = ({
  section,
  onUpdate
}) => {
  // Use section data or provide defaults
  const data = section.data || {};
  const style = section.style || {};
  const [showColorPicker, setShowColorPicker] = useState(false);
  
  // Update section data
  const updateData = (key: string, value: any) => {
    onUpdate({
      data: {
        ...data,
        [key]: value
      }
    });
  };
  
  // Update section style
  const updateStyle = (key: string, value: any) => {
    onUpdate({
      style: {
        ...style,
        [key]: value
      }
    });
  };
  
  // Update section variant
  const updateVariant = (variant: string) => {
    onUpdate({ componentVariant: variant });
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Hero Content */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Hero Content</h3>
          
          <FormItem>
            <FormLabel>Heading</FormLabel>
            <FormControl>
              <Input 
                value={data.heading || ''} 
                onChange={(e) => updateData('heading', e.target.value)}
                placeholder="Main heading" 
              />
            </FormControl>
          </FormItem>
          
          <FormItem>
            <FormLabel>Subheading</FormLabel>
            <FormControl>
              <Textarea
                value={data.subheading || ''} 
                onChange={(e) => updateData('subheading', e.target.value)}
                placeholder="Supporting text"
                rows={3}
              />
            </FormControl>
          </FormItem>
          
          <div className="grid grid-cols-2 gap-4">
            <FormItem>
              <FormLabel>Primary CTA Text</FormLabel>
              <FormControl>
                <Input 
                  value={data.ctaText || ''} 
                  onChange={(e) => updateData('ctaText', e.target.value)}
                  placeholder="Get Started" 
                />
              </FormControl>
            </FormItem>
            
            <FormItem>
              <FormLabel>Primary CTA Link</FormLabel>
              <FormControl>
                <Input 
                  value={data.ctaUrl || ''} 
                  onChange={(e) => updateData('ctaUrl', e.target.value)}
                  placeholder="/get-started" 
                />
              </FormControl>
            </FormItem>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <FormItem>
              <FormLabel>Secondary CTA Text</FormLabel>
              <FormControl>
                <Input 
                  value={data.secondaryCtaText || ''} 
                  onChange={(e) => updateData('secondaryCtaText', e.target.value)}
                  placeholder="Learn More" 
                />
              </FormControl>
            </FormItem>
            
            <FormItem>
              <FormLabel>Secondary CTA Link</FormLabel>
              <FormControl>
                <Input 
                  value={data.secondaryCtaUrl || ''} 
                  onChange={(e) => updateData('secondaryCtaUrl', e.target.value)}
                  placeholder="/learn-more" 
                />
              </FormControl>
            </FormItem>
          </div>
        </div>
        
        {/* Hero Styling */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Styling</h3>
          
          <FormItem>
            <FormLabel>Layout Variant</FormLabel>
            <Select 
              value={section.componentVariant || 'centered'} 
              onValueChange={updateVariant}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select variant" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="centered">Centered</SelectItem>
                <SelectItem value="split">Split (Text + Image)</SelectItem>
                <SelectItem value="fullwidth">Full Width</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
          
          <FormItem>
            <FormLabel>Text Alignment</FormLabel>
            <Select 
              value={style.textAlign || 'center'} 
              onValueChange={(value) => updateStyle('textAlign', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Text alignment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="right">Right</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
          
          <FormItem>
            <FormLabel>Padding</FormLabel>
            <FormControl>
              <Input 
                value={style.padding || '2rem 0'} 
                onChange={(e) => updateStyle('padding', e.target.value)}
                placeholder="2rem 0" 
              />
            </FormControl>
          </FormItem>
          
          <FormItem>
            <FormLabel>Background Color</FormLabel>
            <div className="flex items-center gap-2">
              <div 
                className="w-6 h-6 border rounded"
                style={{ backgroundColor: style.backgroundColor || '#ffffff' }}
              />
              <Popover open={showColorPicker} onOpenChange={setShowColorPicker}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    Change Color
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 border-none">
                  <ChromePicker
                    color={style.backgroundColor || '#ffffff'}
                    onChange={(color) => updateStyle('backgroundColor', color.hex)}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </FormItem>
          
          <FormItem>
            <FormLabel>Background Image URL</FormLabel>
            <FormControl>
              <Input 
                value={style.backgroundImage || ''} 
                onChange={(e) => updateStyle('backgroundImage', e.target.value)}
                placeholder="https://example.com/image.jpg" 
              />
            </FormControl>
          </FormItem>
        </div>
      </div>
    </div>
  );
};

export default HeroSectionEditor;
