
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Ruler,
  Lock,
  Unlock,
  PlusCircle,
  Trash,
  Palette,
  ArrowRightLeft,
  ArrowUpDown,
  Grid,
  Bookmark,
  BookmarkPlus,
  Copy,
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export interface Guide {
  id: string;
  type: 'horizontal' | 'vertical';
  position: number;
  color: string;
  locked: boolean;
  name?: string;
}

export interface GuidePreset {
  id: string;
  name: string;
  guides: Guide[];
}

interface GuideManagementProps {
  guides: Guide[];
  onAddGuide: (guide: Omit<Guide, 'id'>) => void;
  onRemoveGuide: (id: string) => void;
  onUpdateGuide: (id: string, updates: Partial<Guide>) => void;
  onToggleGuidesVisibility: () => void;
  guidesVisible: boolean;
  presets: GuidePreset[];
  onAddPreset: (preset: Omit<GuidePreset, 'id'>) => void;
  onRemovePreset: (id: string) => void;
  onApplyPreset: (preset: GuidePreset) => void;
  canvasWidth: number;
  canvasHeight: number;
  className?: string;
}

const GUIDE_COLORS = [
  '#FF5733', '#33FF57', '#3357FF', '#F333FF', '#FF33F3', 
  '#33FFF3', '#FFF333', '#FF8333', '#8333FF', '#33FF83'
];

const GuideManagement: React.FC<GuideManagementProps> = ({
  guides,
  onAddGuide,
  onRemoveGuide,
  onUpdateGuide,
  onToggleGuidesVisibility,
  guidesVisible,
  presets,
  onAddPreset,
  onRemovePreset,
  onApplyPreset,
  canvasWidth,
  canvasHeight,
  className
}) => {
  const [activeTab, setActiveTab] = useState('guides');
  const [newGuideName, setNewGuideName] = useState('');
  const [newGuidePosition, setNewGuidePosition] = useState(0);
  const [newGuideType, setNewGuideType] = useState<'horizontal' | 'vertical'>('horizontal');
  const [newGuideColor, setNewGuideColor] = useState(GUIDE_COLORS[0]);
  const [newPresetName, setNewPresetName] = useState('');
  
  const verticalGuides = guides.filter(guide => guide.type === 'vertical');
  const horizontalGuides = guides.filter(guide => guide.type === 'horizontal');
  
  const handleAddGuide = () => {
    onAddGuide({
      type: newGuideType,
      position: newGuidePosition,
      color: newGuideColor,
      locked: false,
      name: newGuideName || undefined
    });
    
    // Reset form
    setNewGuideName('');
  };
  
  const handleSaveAsPreset = () => {
    if (newPresetName.trim() === '') return;
    
    onAddPreset({
      name: newPresetName,
      guides: [...guides]
    });
    
    setNewPresetName('');
  };
  
  const handleUpdateGuideColor = (id: string, color: string) => {
    onUpdateGuide(id, { color });
  };
  
  const handleToggleGuideLock = (id: string, currentLocked: boolean) => {
    onUpdateGuide(id, { locked: !currentLocked });
  };
  
  const handleUpdateGuidePosition = (id: string, position: number) => {
    onUpdateGuide(id, { position });
  };

  return (
    <div className={cn("bg-background border rounded-md p-3 space-y-3 w-80", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium flex items-center">
          <Ruler className="h-4 w-4 mr-1" />
          Guides
        </h3>
        <div className="flex items-center gap-2">
          <Button
            variant={guidesVisible ? "default" : "outline"}
            size="sm"
            onClick={onToggleGuidesVisibility}
            className="h-7 px-2 text-xs"
          >
            {guidesVisible ? "Hide Guides" : "Show Guides"}
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="guides" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 h-8">
          <TabsTrigger value="guides" className="text-xs">Guides</TabsTrigger>
          <TabsTrigger value="presets" className="text-xs">Presets</TabsTrigger>
        </TabsList>
        
        <TabsContent value="guides" className="space-y-3 pt-2">
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Type</Label>
                <Select 
                  value={newGuideType} 
                  onValueChange={(value) => setNewGuideType(value as 'horizontal' | 'vertical')}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="horizontal">Horizontal</SelectItem>
                    <SelectItem value="vertical">Vertical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-1">
                <Label className="text-xs">Position</Label>
                <Input
                  type="number"
                  value={newGuidePosition}
                  onChange={(e) => setNewGuidePosition(parseInt(e.target.value) || 0)}
                  min={0}
                  max={newGuideType === 'horizontal' ? canvasHeight : canvasWidth}
                  className="h-8 text-xs"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Name (optional)</Label>
                <Input
                  type="text"
                  value={newGuideName}
                  onChange={(e) => setNewGuideName(e.target.value)}
                  className="h-8 text-xs"
                  placeholder="e.g., Header bottom"
                />
              </div>
              
              <div className="space-y-1">
                <Label className="text-xs">Color</Label>
                <div className="flex flex-wrap gap-1 pt-1">
                  {GUIDE_COLORS.slice(0, 5).map(color => (
                    <div
                      key={color}
                      className={cn(
                        "w-5 h-5 rounded-full cursor-pointer border",
                        newGuideColor === color && "ring-2 ring-primary"
                      )}
                      style={{ backgroundColor: color }}
                      onClick={() => setNewGuideColor(color)}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <Button 
              variant="outline"
              size="sm"
              onClick={handleAddGuide}
              className="w-full"
            >
              <PlusCircle className="h-4 w-4 mr-1" />
              Add Guide
            </Button>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <h3 className="text-xs font-medium flex items-center">
              <ArrowRightLeft className="h-3 w-3 mr-1" />
              Vertical Guides
            </h3>
            <ScrollArea className="h-32 border rounded-md">
              {verticalGuides.length === 0 ? (
                <div className="p-2 text-xs text-muted-foreground">No vertical guides yet</div>
              ) : (
                <div className="p-2 space-y-2">
                  {verticalGuides.map(guide => (
                    <div key={guide.id} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: guide.color }}
                        />
                        <span className="font-medium">{guide.position}px</span>
                        {guide.name && (
                          <Badge variant="outline" className="ml-1 text-[10px] h-4">
                            {guide.name}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-5 w-5">
                              <Palette className="h-3 w-3" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-40 p-2" side="left">
                            <div className="flex flex-wrap gap-1">
                              {GUIDE_COLORS.map(color => (
                                <div
                                  key={color}
                                  className={cn(
                                    "w-5 h-5 rounded-full cursor-pointer border",
                                    guide.color === color && "ring-2 ring-primary"
                                  )}
                                  style={{ backgroundColor: color }}
                                  onClick={() => handleUpdateGuideColor(guide.id, color)}
                                />
                              ))}
                            </div>
                          </PopoverContent>
                        </Popover>
                        
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleToggleGuideLock(guide.id, guide.locked)}
                          className="h-5 w-5"
                        >
                          {guide.locked ? (
                            <Lock className="h-3 w-3" />
                          ) : (
                            <Unlock className="h-3 w-3" />
                          )}
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => onRemoveGuide(guide.id)}
                          className="h-5 w-5 text-destructive"
                        >
                          <Trash className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
            
            <h3 className="text-xs font-medium flex items-center mt-3">
              <ArrowUpDown className="h-3 w-3 mr-1" />
              Horizontal Guides
            </h3>
            <ScrollArea className="h-32 border rounded-md">
              {horizontalGuides.length === 0 ? (
                <div className="p-2 text-xs text-muted-foreground">No horizontal guides yet</div>
              ) : (
                <div className="p-2 space-y-2">
                  {horizontalGuides.map(guide => (
                    <div key={guide.id} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: guide.color }}
                        />
                        <span className="font-medium">{guide.position}px</span>
                        {guide.name && (
                          <Badge variant="outline" className="ml-1 text-[10px] h-4">
                            {guide.name}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-5 w-5">
                              <Palette className="h-3 w-3" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-40 p-2" side="left">
                            <div className="flex flex-wrap gap-1">
                              {GUIDE_COLORS.map(color => (
                                <div
                                  key={color}
                                  className={cn(
                                    "w-5 h-5 rounded-full cursor-pointer border",
                                    guide.color === color && "ring-2 ring-primary"
                                  )}
                                  style={{ backgroundColor: color }}
                                  onClick={() => handleUpdateGuideColor(guide.id, color)}
                                />
                              ))}
                            </div>
                          </PopoverContent>
                        </Popover>
                        
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleToggleGuideLock(guide.id, guide.locked)}
                          className="h-5 w-5"
                        >
                          {guide.locked ? (
                            <Lock className="h-3 w-3" />
                          ) : (
                            <Unlock className="h-3 w-3" />
                          )}
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => onRemoveGuide(guide.id)}
                          className="h-5 w-5 text-destructive"
                        >
                          <Trash className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
          
          <div className="pt-2">
            <div className="flex items-center gap-2">
              <Input
                type="text"
                value={newPresetName}
                onChange={(e) => setNewPresetName(e.target.value)}
                className="h-8 text-xs"
                placeholder="Preset name"
              />
              <Button 
                variant="outline"
                size="sm"
                onClick={handleSaveAsPreset}
                disabled={newPresetName.trim() === '' || guides.length === 0}
                className="whitespace-nowrap"
              >
                <BookmarkPlus className="h-4 w-4 mr-1" />
                Save as Preset
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="presets" className="space-y-3 pt-2">
          {presets.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-4 border rounded-md">
              <Bookmark className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground mb-1">No guide presets yet</p>
              <p className="text-xs text-muted-foreground">Save your current guides as a preset to use them later.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {presets.map(preset => (
                <div
                  key={preset.id}
                  className="border rounded-md p-2 text-sm hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{preset.name}</span>
                    <div className="flex items-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onApplyPreset(preset)}
                        className="h-6 w-6"
                        title="Apply preset"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemovePreset(preset.id)}
                        className="h-6 w-6 text-destructive"
                        title="Delete preset"
                      >
                        <Trash className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Badge variant="secondary" className="h-5">{preset.guides.filter(g => g.type === 'vertical').length}</Badge>
                    <span className="text-muted-foreground">vertical</span>
                    <Badge variant="secondary" className="h-5">{preset.guides.filter(g => g.type === 'horizontal').length}</Badge>
                    <span className="text-muted-foreground">horizontal</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveTab('guides')}
              className="w-full"
            >
              <Grid className="h-4 w-4 mr-1" />
              Manage Current Guides
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GuideManagement;
