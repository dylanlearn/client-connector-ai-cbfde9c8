
import React from 'react';
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown, LayoutGrid, LayoutTemplate, Save, Star, Trash } from "lucide-react";
import { cn } from '@/lib/utils';
import { GridPreset } from '@/components/wireframe/types/canvas-types';

interface GridPresetSelectorProps {
  presets: GridPreset[];
  activePresetId: string | null;
  onSelectPreset: (preset: GridPreset) => void;
  onSaveCurrentAsPreset?: () => void;
  onDeletePreset?: (preset: GridPreset) => void;
}

const GridPresetSelector: React.FC<GridPresetSelectorProps> = ({
  presets,
  activePresetId,
  onSelectPreset,
  onSaveCurrentAsPreset,
  onDeletePreset
}) => {
  const [open, setOpen] = React.useState(false);
  
  // Group presets by category
  const presetsByCategory = React.useMemo(() => {
    const groupedPresets: Record<string, GridPreset[]> = {};
    
    presets.forEach(preset => {
      const category = preset.category || 'Uncategorized';
      
      if (!groupedPresets[category]) {
        groupedPresets[category] = [];
      }
      
      groupedPresets[category].push(preset);
    });
    
    return groupedPresets;
  }, [presets]);
  
  // Get active preset name
  const activePresetName = React.useMemo(() => {
    if (!activePresetId) return 'Custom';
    
    const activePreset = presets.find(p => p.id === activePresetId);
    return activePreset ? activePreset.name : 'Custom';
  }, [activePresetId, presets]);
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          <LayoutTemplate className="mr-2 h-4 w-4" />
          <span className="truncate">{activePresetName}</span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search grid presets..." />
          <CommandList>
            <CommandEmpty>No presets found.</CommandEmpty>
            
            {Object.entries(presetsByCategory).map(([category, categoryPresets]) => (
              <React.Fragment key={category}>
                <CommandGroup heading={category}>
                  {categoryPresets.map((preset) => (
                    <CommandItem
                      key={preset.id}
                      value={preset.name}
                      onSelect={() => {
                        onSelectPreset(preset);
                        setOpen(false);
                      }}
                      className="flex justify-between"
                    >
                      <div className="flex items-center">
                        {preset.isSystem ? (
                          <Star className="mr-2 h-4 w-4 text-yellow-500" />
                        ) : (
                          <LayoutGrid className="mr-2 h-4 w-4" />
                        )}
                        <span className="truncate">{preset.name}</span>
                      </div>
                      
                      <div className="flex items-center">
                        {preset.id === activePresetId && (
                          <Check className="h-4 w-4" />
                        )}
                        
                        {onDeletePreset && !preset.isSystem && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 ml-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeletePreset(preset);
                            }}
                          >
                            <Trash className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandSeparator />
              </React.Fragment>
            ))}
            
            {onSaveCurrentAsPreset && (
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    onSaveCurrentAsPreset();
                    setOpen(false);
                  }}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Current as Preset...
                </CommandItem>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default GridPresetSelector;
