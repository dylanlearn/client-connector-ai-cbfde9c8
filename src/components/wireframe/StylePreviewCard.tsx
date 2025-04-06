
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StylePreviewCardProps {
  styleName: string;
  description?: string;
  selected?: boolean;
  onClick?: () => void;
  darkMode?: boolean;
}

const StylePreviewCard: React.FC<StylePreviewCardProps> = ({
  styleName,
  description,
  selected = false,
  onClick,
  darkMode = false
}) => {
  // Style-specific preview elements
  const getStylePreview = () => {
    const baseClasses = "w-full h-full flex flex-col";
    const headerClasses = "h-4 mb-2 flex items-center";
    const contentClasses = "flex-1";

    switch (styleName.toLowerCase()) {
      case 'brutalist':
        return (
          <div className={cn(baseClasses, darkMode ? "bg-gray-900 text-white" : "bg-white text-black", "border-4 border-black dark:border-white p-2")}>
            <div className={headerClasses}>
              <div className="w-12 h-2 bg-current"></div>
            </div>
            <div className={cn(contentClasses, "grid grid-cols-2 gap-1")}>
              <div className="bg-current h-4 w-full"></div>
              <div className="bg-current h-4 w-full"></div>
              <div className="bg-current h-4 w-full"></div>
              <div className="bg-current h-4 w-full"></div>
            </div>
          </div>
        );
      
      case 'glassy':
        return (
          <div className={cn(baseClasses, darkMode ? "bg-gradient-to-br from-gray-900 to-gray-800" : "bg-gradient-to-br from-blue-50 to-purple-50", "rounded-xl p-2")}>
            <div className={headerClasses}>
              <div className="w-12 h-2 bg-white/70 dark:bg-white/40 rounded-full"></div>
            </div>
            <div className={cn(contentClasses, "flex flex-col space-y-1")}>
              <div className="bg-white/20 dark:bg-white/10 backdrop-blur-sm rounded-lg h-3 w-full"></div>
              <div className="bg-white/20 dark:bg-white/10 backdrop-blur-sm rounded-lg h-3 w-3/4"></div>
              <div className="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-full h-2 w-1/2 mt-1"></div>
            </div>
          </div>
        );
      
      case 'minimalist':
        return (
          <div className={cn(baseClasses, darkMode ? "bg-gray-900 text-gray-300" : "bg-white text-gray-800", "p-2")}>
            <div className={headerClasses}>
              <div className="w-10 h-1 bg-current"></div>
            </div>
            <div className={cn(contentClasses, "flex flex-col space-y-2")}>
              <div className="h-2 w-3/4 bg-current opacity-80"></div>
              <div className="h-1 w-full bg-current opacity-30"></div>
              <div className="h-1 w-full bg-current opacity-30"></div>
              <div className="h-1 w-2/3 bg-current opacity-30"></div>
            </div>
          </div>
        );
      
      case 'corporate':
        return (
          <div className={cn(baseClasses, darkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900", "border-b-2 border-gray-400 p-2")}>
            <div className={cn(headerClasses, "justify-between")}>
              <div className="w-8 h-2 bg-blue-500 dark:bg-blue-400"></div>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-current rounded-full"></div>
                <div className="w-2 h-2 bg-current rounded-full"></div>
                <div className="w-2 h-2 bg-current rounded-full"></div>
              </div>
            </div>
            <div className={cn(contentClasses, "grid grid-cols-3 gap-1")}>
              <div className="col-span-2 bg-current h-4 opacity-80"></div>
              <div className="bg-blue-500 dark:bg-blue-400 h-4"></div>
              <div className="col-span-3 bg-current h-2 opacity-30 mt-1"></div>
            </div>
          </div>
        );
      
      case 'playful':
        return (
          <div className={cn(baseClasses, darkMode ? "bg-gray-800" : "bg-blue-50", "rounded-xl p-2")}>
            <div className={cn(headerClasses, "justify-center")}>
              <div className="w-6 h-6 rounded-full bg-purple-500 dark:bg-purple-400"></div>
            </div>
            <div className={cn(contentClasses, "grid grid-cols-2 gap-2 mt-1")}>
              <div className="bg-yellow-400 dark:bg-yellow-500 h-3 rounded-lg"></div>
              <div className="bg-pink-400 dark:bg-pink-500 h-3 rounded-lg"></div>
              <div className="bg-green-400 dark:bg-green-500 h-3 rounded-lg"></div>
              <div className="bg-blue-400 dark:bg-blue-500 h-3 rounded-lg"></div>
            </div>
          </div>
        );
      
      case 'editorial':
        return (
          <div className={cn(baseClasses, darkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900", "p-2")}>
            <div className={headerClasses}>
              <div className="w-16 h-3 bg-current font-serif"></div>
            </div>
            <div className={cn(contentClasses, "flex flex-col space-y-1")}>
              <div className="h-2 w-full bg-current opacity-80"></div>
              <div className="h-2 w-full bg-current opacity-30"></div>
              <div className="h-2 w-full bg-current opacity-30"></div>
              <div className="h-2 w-2/3 bg-current opacity-30"></div>
            </div>
          </div>
        );
      
      case 'tech-forward':
        return (
          <div className={cn(baseClasses, darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900", "border-l-4 border-blue-500 dark:border-blue-400 p-2")}>
            <div className={headerClasses}>
              <div className="font-mono text-xs">[&gt;_]</div>
            </div>
            <div className={cn(contentClasses, "grid grid-rows-3 gap-1")}>
              <div className="bg-blue-500/20 dark:bg-blue-500/30 h-2 w-full rounded-sm"></div>
              <div className="bg-current h-2 w-full opacity-70 rounded-sm"></div>
              <div className="bg-current h-2 w-2/3 opacity-40 rounded-sm"></div>
            </div>
          </div>
        );
      
      case 'bold':
        return (
          <div className={cn(baseClasses, darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900", "p-2")}>
            <div className={cn(headerClasses, "h-6")}>
              <div className="w-16 h-4 bg-black dark:bg-white"></div>
            </div>
            <div className={cn(contentClasses, "flex flex-col space-y-1")}>
              <div className="h-3 w-full bg-black dark:bg-white"></div>
              <div className="h-3 w-3/4 bg-black dark:bg-white opacity-70"></div>
              <div className="h-2 w-1/2 bg-blue-500 dark:bg-blue-400 mt-1 rounded-sm"></div>
            </div>
          </div>
        );
        
      default: // modern
        return (
          <div className={cn(baseClasses, darkMode ? "bg-gray-900 text-gray-100" : "bg-white", "rounded-lg p-2 shadow-sm")}>
            <div className={headerClasses}>
              <div className="w-12 h-2 bg-blue-500 rounded-full"></div>
            </div>
            <div className={cn(contentClasses, "flex flex-col space-y-1")}>
              <div className="bg-gray-200 dark:bg-gray-700 h-3 w-full rounded"></div>
              <div className="bg-gray-200 dark:bg-gray-700 h-3 w-3/4 rounded"></div>
              <div className="bg-blue-500 h-2 w-1/3 rounded-full mt-1"></div>
            </div>
          </div>
        );
    }
  };

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-200",
        selected ? "ring-2 ring-primary ring-offset-2" : "hover:shadow-md",
        "overflow-hidden"
      )}
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="aspect-square p-1">
          {getStylePreview()}
        </div>
        <div className={cn(
          "text-center py-2 text-sm font-medium",
          selected ? "bg-primary text-primary-foreground" : "bg-muted/50"
        )}>
          {styleName}
        </div>
      </CardContent>
    </Card>
  );
};

export default StylePreviewCard;
