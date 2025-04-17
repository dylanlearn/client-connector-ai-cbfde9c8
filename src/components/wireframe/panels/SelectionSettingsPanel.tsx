import React from 'react';
import { ArrowUpNarrowWide, ArrowDownNarrowWide } from 'lucide-react';
import { useWireframeStudio } from '@/contexts/WireframeStudioContext';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';

interface SelectionSettingsPanelProps {
  className?: string;
}

const SelectionSettingsPanel: React.FC<SelectionSettingsPanelProps> = ({ className }) => {
  const { selectedSection, wireframeData, updateWireframe } = useWireframeStudio();
  
  if (!selectedSection) {
    return (
      <div className={className}>
        <p className="text-sm text-muted-foreground">No section selected.</p>
      </div>
    );
  }
  
  const section = wireframeData.sections.find(section => section.id === selectedSection);
  
  if (!section) {
    return (
      <div className={className}>
        <p className="text-sm text-muted-foreground">Section not found.</p>
      </div>
    );
  }
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    const updatedSections = wireframeData.sections.map(s =>
      s.id === selectedSection ? { ...s, title: newTitle } : s
    );
    updateWireframe({ ...wireframeData, sections: updatedSections });
  };
  
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDescription = e.target.value;
    const updatedSections = wireframeData.sections.map(s =>
      s.id === selectedSection ? { ...s, description: newDescription } : s
    );
    updateWireframe({ ...wireframeData, sections: updatedSections });
  };
  
  const handleOrderChange = (newOrder: number[]) => {
    const updatedSections = wireframeData.sections.map(s => {
        const newIndex = newOrder.indexOf(s.order);
        return { ...s, order: newIndex };
    }).sort((a, b) => a.order - b.order);
    
    updateWireframe({ ...wireframeData, sections: updatedSections });
  };
  
  return (
    <div className={className}>
      <div className="space-y-4">
        <div>
          <Label htmlFor="section-title">Title</Label>
          <Input 
            type="text" 
            id="section-title" 
            value={section.title} 
            onChange={handleTitleChange} 
          />
        </div>
        <div>
          <Label htmlFor="section-description">Description</Label>
          <Input 
            type="text" 
            id="section-description" 
            value={section.description} 
            onChange={handleDescriptionChange} 
          />
        </div>
        <div>
          <Label>Order</Label>
          <div className="flex items-center space-x-2">
            <ArrowUpNarrowWide className="h-4 w-4 cursor-pointer" />
            <Slider 
              defaultValue={[section.order]}
              max={wireframeData.sections.length - 1}
              step={1}
              onValueChange={(value) => {
                const newOrder = wireframeData.sections.map((s, index) => index);
                newOrder[section.order] = value[0];
                handleOrderChange(newOrder);
              }}
            />
            <ArrowDownNarrowWide className="h-4 w-4 cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectionSettingsPanel;
