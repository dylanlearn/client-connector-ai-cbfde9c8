
import React from 'react';
import { ArrowUpNarrowWide, ArrowDownNarrowWide } from 'lucide-react';
import { useWireframeStudio } from '@/contexts/WireframeStudioContext';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';

interface SelectionSettingsPanelProps {
  className?: string;
  canvas?: any; // Add canvas prop
  selectedObjects?: any[]; // Add selectedObjects prop
  onDelete?: () => void; // Add callback props
  onDuplicate?: () => void;
  onBringForward?: () => void;
  onSendBackward?: () => void;
  onLockToggle?: () => void;
}

const SelectionSettingsPanel: React.FC<SelectionSettingsPanelProps> = ({ 
  className,
  selectedObjects,
  canvas,
  onDelete,
  onDuplicate,
  onBringForward,
  onSendBackward,
  onLockToggle
}) => {
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
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    const updatedSections = wireframeData.sections.map(s =>
      s.id === selectedSection ? { ...s, name: newName } : s
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
  
  const handlePositionChange = (newPosition: number) => {
    // Get current sections and their positions
    const sections = [...wireframeData.sections];
    const currentIndex = sections.findIndex(s => s.id === selectedSection);
    
    // Ensure valid bounds
    if (newPosition < 0) newPosition = 0;
    if (newPosition >= sections.length) newPosition = sections.length - 1;
    
    // If position hasn't changed, do nothing
    if (currentIndex === newPosition) return;
    
    // Remove the section from its current position
    const [movedSection] = sections.splice(currentIndex, 1);
    
    // Insert it at the new position
    sections.splice(newPosition, 0, movedSection);
    
    // Update the wireframe with reordered sections
    updateWireframe({ ...wireframeData, sections });
  };
  
  // Find the current index of the selected section
  const currentIndex = wireframeData.sections.findIndex(s => s.id === selectedSection);
  
  return (
    <div className={className}>
      <div className="space-y-4">
        <div>
          <Label htmlFor="section-name">Name</Label>
          <Input 
            type="text" 
            id="section-name" 
            value={section.name || ''} 
            onChange={handleNameChange} 
          />
        </div>
        <div>
          <Label htmlFor="section-description">Description</Label>
          <Input 
            type="text" 
            id="section-description" 
            value={section.description || ''} 
            onChange={handleDescriptionChange} 
          />
        </div>
        <div>
          <Label>Position</Label>
          <div className="flex items-center space-x-2">
            <ArrowUpNarrowWide className="h-4 w-4 cursor-pointer" />
            <Slider 
              defaultValue={[currentIndex]}
              max={wireframeData.sections.length - 1}
              step={1}
              onValueChange={(value) => handlePositionChange(value[0])}
            />
            <ArrowDownNarrowWide className="h-4 w-4 cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectionSettingsPanel;
