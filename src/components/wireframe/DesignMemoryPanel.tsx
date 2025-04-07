
import React, { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DesignReference,
  DesignReferenceSearchParams
} from "@/services/ai/design/design-memory-reference-service";
import { useDesignReferences } from "@/hooks/use-design-references";
import { cn } from "@/lib/utils";
import { ImageIcon, Search, Tag, Clock, ExternalLink } from "lucide-react";
import { format } from "date-fns";

interface DesignMemoryPanelProps {
  darkMode?: boolean;
  onSelectReference?: (reference: DesignReference) => void;
  onSaveCurrentDesign?: () => Promise<DesignReference | null>;
  className?: string;
  selectedReferenceId?: string;
  filterType?: string;
}

export const DesignMemoryPanel: React.FC<DesignMemoryPanelProps> = ({
  darkMode = false,
  onSelectReference,
  onSaveCurrentDesign,
  className,
  selectedReferenceId,
  filterType
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(filterType || null);
  const { references, isLoading, searchReferences, storeReference } = useDesignReferences();
  
  useEffect(() => {
    // Load initial references
    searchReferences({
      limit: 20,
      type: filterType as any || undefined
    });
  }, [searchReferences, filterType]);
  
  const handleSearch = () => {
    const params: DesignReferenceSearchParams = {
      query: searchQuery || undefined,
      type: selectedType as any || undefined,
      limit: 20
    };
    
    searchReferences(params);
  };
  
  const handleTypeFilter = (type: string) => {
    setSelectedType(selectedType === type ? null : type);
    
    // Apply filter immediately
    searchReferences({
      query: searchQuery || undefined,
      type: selectedType === type ? undefined : (type as any),
      limit: 20
    });
  };
  
  const handleSaveCurrentDesign = async () => {
    if (onSaveCurrentDesign) {
      const result = await onSaveCurrentDesign();
      if (result) {
        // Refresh references
        searchReferences({
          limit: 20
        });
      }
    }
  };
  
  return (
    <div className={cn(
      "design-memory-panel",
      darkMode ? "text-gray-200" : "",
      className
    )}>
      <div className={cn(
        "p-3 border-b mb-3",
        darkMode ? "border-gray-700" : "border-gray-200"
      )}>
        <h3 className="font-semibold mb-3">Design Memory References</h3>
        
        <div className="flex gap-2 mb-3">
          <Input
            placeholder="Search designs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={darkMode ? "bg-gray-800 border-gray-700" : ""}
          />
          <Button size="sm" onClick={handleSearch}>
            <Search className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge
            variant={selectedType === 'wireframe' ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => handleTypeFilter('wireframe')}
          >
            Wireframes
          </Badge>
          <Badge
            variant={selectedType === 'component' ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => handleTypeFilter('component')}
          >
            Components
          </Badge>
          <Badge
            variant={selectedType === 'layout' ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => handleTypeFilter('layout')}
          >
            Layouts
          </Badge>
          <Badge
            variant={selectedType === 'color-scheme' ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => handleTypeFilter('color-scheme')}
          >
            Colors
          </Badge>
        </div>
        
        {onSaveCurrentDesign && (
          <Button 
            size="sm" 
            variant="secondary" 
            onClick={handleSaveCurrentDesign}
            className="w-full"
          >
            Save Current Design to Memory
          </Button>
        )}
      </div>
      
      <ScrollArea className="h-[calc(100%-140px)]">
        {isLoading ? (
          <div className="p-4 text-center">Loading references...</div>
        ) : references.length === 0 ? (
          <div className="p-4 text-center">
            <p>No design references found</p>
            <p className="text-sm text-muted-foreground">
              Save designs to build your memory reference library
            </p>
          </div>
        ) : (
          <div className="grid gap-3 p-3">
            {references.map((reference) => (
              <Card 
                key={reference.id} 
                className={cn(
                  "overflow-hidden cursor-pointer hover:shadow-md transition-shadow",
                  darkMode ? "bg-gray-800 border-gray-700" : "",
                  selectedReferenceId === reference.id ? "ring-2 ring-primary" : ""
                )}
                onClick={() => onSelectReference?.(reference)}
              >
                <CardContent className="p-3">
                  {reference.screenshot_url && (
                    <div className={cn(
                      "h-32 mb-2 rounded bg-cover bg-center",
                      darkMode ? "bg-gray-700" : "bg-gray-100"
                    )} 
                    style={{ 
                      backgroundImage: reference.screenshot_url ? 
                        `url(${reference.screenshot_url})` : 
                        undefined 
                    }}>
                      {!reference.screenshot_url && (
                        <div className="flex items-center justify-center h-full">
                          <ImageIcon className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-medium text-sm">{reference.title}</h4>
                      <Badge variant="outline">{reference.type}</Badge>
                    </div>
                    
                    {reference.description && (
                      <p className={cn(
                        "text-xs mb-2",
                        darkMode ? "text-gray-400" : "text-gray-500"
                      )}>
                        {reference.description.length > 100 
                          ? reference.description.slice(0, 100) + '...' 
                          : reference.description}
                      </p>
                    )}
                    
                    <div className="flex items-center text-xs gap-1 mt-2">
                      <Clock className="h-3 w-3" />
                      <span className={darkMode ? "text-gray-400" : "text-gray-500"}>
                        {format(new Date(reference.created_at), 'MMM d, yyyy')}
                      </span>
                    </div>
                    
                    {reference.tags && reference.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        <Tag className="h-3 w-3" />
                        {reference.tags.slice(0, 3).map((tag, idx) => (
                          <span 
                            key={idx}
                            className={cn(
                              "text-xs px-1 rounded",
                              darkMode ? "bg-gray-700" : "bg-gray-100"
                            )}
                          >
                            {tag}
                          </span>
                        ))}
                        {reference.tags.length > 3 && (
                          <span className="text-xs">+{reference.tags.length - 3}</span>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default DesignMemoryPanel;
