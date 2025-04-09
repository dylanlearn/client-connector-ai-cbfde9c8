
import React from 'react';
import { LibraryComponent } from '@/hooks/wireframe/use-component-library';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { 
  Star, StarOff, MoreVertical, Plus, Trash, Edit, Copy
} from 'lucide-react';

interface LibraryComponentCardProps {
  component: LibraryComponent;
  view: 'grid' | 'list';
  onSelect?: () => void;
  onAddToCanvas?: () => void;
  onToggleFavorite?: () => void;
  onEdit?: () => void;
  onDuplicate?: () => void;
  onRemove?: () => void;
}

const LibraryComponentCard: React.FC<LibraryComponentCardProps> = ({
  component,
  view,
  onSelect,
  onAddToCanvas,
  onToggleFavorite,
  onEdit,
  onDuplicate,
  onRemove
}) => {
  const handleClick = () => {
    onSelect?.();
  };

  return view === 'grid' ? (
    <div 
      className="border rounded-md overflow-hidden bg-card hover:shadow-md transition-shadow"
      onClick={handleClick}
    >
      <div className="aspect-video bg-accent/20 flex items-center justify-center relative">
        {/* Thumbnail preview */}
        {component.thumbnail ? (
          <img 
            src={component.thumbnail} 
            alt={component.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-muted-foreground text-xs">
            {component.name.substring(0, 1).toUpperCase()}
          </div>
        )}
        
        {/* Favorite button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1 left-1 h-6 w-6 bg-background/50 backdrop-blur-sm hover:bg-background/80"
          onClick={(e) => { 
            e.stopPropagation();
            onToggleFavorite?.();
          }}
        >
          {component.favorite ? (
            <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
          ) : (
            <StarOff className="h-3.5 w-3.5" />
          )}
        </Button>
        
        {/* Add to canvas button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1 right-1 h-6 w-6 bg-background/50 backdrop-blur-sm hover:bg-background/80"
          onClick={(e) => {
            e.stopPropagation();
            onAddToCanvas?.();
          }}
        >
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>
      
      <div className="p-2">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-medium truncate">{component.name}</h3>
            {component.description && (
              <p className="text-xs text-muted-foreground truncate">
                {component.description}
              </p>
            )}
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 -mr-1"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                onAddToCanvas?.();
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Add to Canvas
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                onEdit?.();
              }}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                onDuplicate?.();
              }}>
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite?.();
              }}>
                {component.favorite ? (
                  <>
                    <StarOff className="h-4 w-4 mr-2" />
                    Remove from Favorites
                  </>
                ) : (
                  <>
                    <Star className="h-4 w-4 mr-2" />
                    Add to Favorites
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove?.();
                }}
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {component.tags.length > 0 && (
          <div className="flex gap-1 mt-1 flex-wrap">
            {component.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index} 
                className="px-1.5 py-0.5 bg-accent text-accent-foreground rounded text-[10px]"
              >
                {tag}
              </span>
            ))}
            {component.tags.length > 3 && (
              <span className="px-1.5 py-0.5 bg-muted text-muted-foreground rounded text-[10px]">
                +{component.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  ) : (
    <div 
      className="border rounded-md flex items-center p-2 hover:bg-accent/10 cursor-pointer"
      onClick={handleClick}
    >
      {/* Thumbnail (small) */}
      <div className="w-10 h-10 bg-accent/20 rounded flex items-center justify-center mr-3">
        {component.thumbnail ? (
          <img 
            src={component.thumbnail} 
            alt={component.name} 
            className="w-full h-full object-cover rounded"
          />
        ) : (
          <div className="text-muted-foreground text-xs">
            {component.name.substring(0, 1).toUpperCase()}
          </div>
        )}
      </div>
      
      {/* Component details */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium truncate">{component.name}</h3>
        {component.description && (
          <p className="text-xs text-muted-foreground truncate">
            {component.description}
          </p>
        )}
      </div>
      
      {/* Action buttons */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={(e) => { 
            e.stopPropagation();
            onToggleFavorite?.();
          }}
        >
          {component.favorite ? (
            <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
          ) : (
            <StarOff className="h-3.5 w-3.5" />
          )}
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={(e) => {
            e.stopPropagation();
            onAddToCanvas?.();
          }}
        >
          <Plus className="h-3.5 w-3.5" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation();
              onEdit?.();
            }}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation();
              onDuplicate?.();
            }}>
              <Copy className="h-4 w-4 mr-2" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onRemove?.();
              }}
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default LibraryComponentCard;
