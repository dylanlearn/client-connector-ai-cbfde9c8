
import React, { useState } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { FontFamilyOption, COMMON_FONT_FAMILIES } from './font-constants';
import { ScrollArea } from '@/components/ui/scroll-area';

export interface FontSelectorProps {
  value: string;
  onChange: (value: string) => void;
  fonts?: FontFamilyOption[];
  placeholder?: string;
}

/**
 * FontSelector - A dropdown component for selecting fonts with preview
 */
export const FontSelector: React.FC<FontSelectorProps> = ({
  value,
  onChange,
  fonts = COMMON_FONT_FAMILIES,
  placeholder = 'Select font...'
}) => {
  const [open, setOpen] = useState(false);
  
  // Find the current font in the options
  const selectedFont = fonts.find(font => font.value === value) || {
    name: value,
    value: value,
    category: 'sans-serif' as const
  };
  
  // Group fonts by category
  const fontsByCategory = fonts.reduce((acc, font) => {
    if (!acc[font.category]) {
      acc[font.category] = [];
    }
    acc[font.category].push(font);
    return acc;
  }, {} as Record<string, FontFamilyOption[]>);
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
        >
          <span 
            style={{ fontFamily: `${selectedFont.value}, ${selectedFont.category}` }}
            className="flex items-center gap-2"
          >
            <span className="text-base">
              {selectedFont.name}
            </span>
            <span className="text-muted-foreground text-xs">
              ({selectedFont.category})
            </span>
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-0">
        <Command>
          <CommandInput placeholder="Search fonts..." />
          <CommandEmpty>No font found.</CommandEmpty>
          <ScrollArea className="h-[300px]">
            <CommandList>
              {Object.entries(fontsByCategory).map(([category, categoryFonts]) => (
                <CommandGroup key={category} heading={category.charAt(0).toUpperCase() + category.slice(1)}>
                  {categoryFonts.map((font) => (
                    <CommandItem
                      key={font.value}
                      onSelect={() => {
                        onChange(font.value);
                        setOpen(false);
                      }}
                      className="flex items-center justify-between"
                    >
                      <div className="flex flex-col">
                        <span style={{ fontFamily: `${font.value}, ${font.category}` }} className="font-medium">
                          {font.name}
                        </span>
                        {font.description && (
                          <span className="text-xs text-muted-foreground">
                            {font.description}
                          </span>
                        )}
                      </div>
                      {font.value === value && <Check className="h-4 w-4" />}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
          </ScrollArea>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
