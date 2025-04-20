
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { FontCard } from './FontCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export interface FontSelectorProps {
  fonts: Array<{
    family: string;
    category: 'serif' | 'sans-serif' | 'display' | 'monospace';
    variants?: string[];
  }>;
  selectedFont?: string;
  onFontSelect: (font: string) => void;
}

/**
 * Font Selector - UI for browsing and selecting fonts
 */
export const FontSelector: React.FC<FontSelectorProps> = ({
  fonts,
  selectedFont,
  onFontSelect,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');

  const handleCategoryChange = (value: string) => {
    setCategory(value);
  };

  // Filter fonts based on search query and category
  const filteredFonts = fonts.filter((font) => {
    const matchesSearch = font.family
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      category === 'all' || font.category === category;
    return matchesSearch && matchesCategory;
  });

  const getFontDescription = (font: typeof fonts[0]) => {
    return `${font.variants ? font.variants.length : 1} weights available`;
  };

  return (
    <div className="font-selector space-y-4">
      <Input
        type="search"
        placeholder="Search fonts..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full"
      />

      <Tabs defaultValue="all" onValueChange={handleCategoryChange}>
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="sans-serif">Sans</TabsTrigger>
          <TabsTrigger value="serif">Serif</TabsTrigger>
          <TabsTrigger value="display">Display</TabsTrigger>
          <TabsTrigger value="monospace">Mono</TabsTrigger>
        </TabsList>

        <TabsContent value={category}>
          <ScrollArea className="h-[400px] pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-4">
              {filteredFonts.length > 0 ? (
                filteredFonts.map((font) => (
                  <FontCard
                    key={font.family}
                    fontFamily={font.family}
                    category={font.category}
                    description={getFontDescription(font)}
                    isSelected={font.family === selectedFont}
                    onSelect={() => onFontSelect(font.family)}
                  />
                ))
              ) : (
                <p className="text-muted-foreground text-sm col-span-2 text-center py-4">
                  No fonts found matching your search
                </p>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};
