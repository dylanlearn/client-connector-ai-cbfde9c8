
import React, { useState } from 'react';
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Search, Plus, Star, Clock, Grid, Settings, X, Filter
} from 'lucide-react';
import {
  useComponentLibrary,
  ComponentCategory,
  LibraryComponent
} from '@/hooks/wireframe/use-component-library';
import LibraryComponentCard from './LibraryComponentCard';

interface ComponentLibraryProps {
  onSelectComponent?: (component: LibraryComponent) => void;
  onAddToCanvas?: (component: LibraryComponent) => void;
}

const ComponentLibrary: React.FC<ComponentLibraryProps> = ({
  onSelectComponent,
  onAddToCanvas
}) => {
  const {
    components,
    categories,
    isLoading,
    selectedCategory,
    filteredComponents,
    stats,
    setSelectedCategory,
    toggleFavorite,
    addComponent,
    removeComponent
  } = useComponentLibrary();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  
  // Filter components by search query
  const searchedComponents = searchQuery
    ? filteredComponents.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : filteredComponents;
    
  // Clear search
  const handleClearSearch = () => {
    setSearchQuery('');
  };
  
  return (
    <div className="h-full flex flex-col border rounded-md bg-background">
      <div className="p-3 border-b">
        <h2 className="text-lg font-semibold mb-2">Component Library</h2>
        <div className="relative">
          <Input
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-8"
          />
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1 h-6 w-6"
              onClick={handleClearSearch}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      <Tabs defaultValue="all" className="flex-1 flex flex-col" onValueChange={setSelectedCategory}>
        <div className="px-2 py-1 border-b overflow-x-auto">
          <TabsList className="h-8">
            <TabsTrigger value="all" className="text-xs px-2.5">
              All <span className="ml-1 text-muted-foreground">({stats.totalComponents})</span>
            </TabsTrigger>
            <TabsTrigger value="favorites" className="text-xs px-2.5">
              <Star className="h-3 w-3 mr-1" /> Favorites ({stats.favorites})
            </TabsTrigger>
            <TabsTrigger value="recent" className="text-xs px-2.5">
              <Clock className="h-3 w-3 mr-1" /> Recent ({stats.recentlyAdded})
            </TabsTrigger>
            
            {categories.map(category => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="text-xs px-2.5"
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        
        <div className="flex-1">
          <ScrollArea className="h-full">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                Loading components...
              </div>
            ) : searchedComponents.length > 0 ? (
              <div className="p-3">
                <div className="flex justify-between items-center mb-3">
                  <div className="text-sm text-muted-foreground">
                    {searchedComponents.length} component{searchedComponents.length !== 1 ? 's' : ''}
                  </div>
                  
                  <div className="flex gap-1">
                    <Button 
                      variant={view === 'grid' ? 'secondary' : 'ghost'} 
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => setView('grid')}
                    >
                      <Grid className="h-3.5 w-3.5" />
                    </Button>
                    <Button 
                      variant={view === 'list' ? 'secondary' : 'ghost'} 
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => setView('list')}
                    >
                      <Filter className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                
                <div className={view === 'grid' 
                  ? "grid grid-cols-2 sm:grid-cols-3 gap-3" 
                  : "space-y-2"
                }>
                  {searchedComponents.map(component => (
                    <LibraryComponentCard
                      key={component.id}
                      component={component}
                      view={view}
                      onSelect={() => onSelectComponent?.(component)}
                      onAddToCanvas={() => onAddToCanvas?.(component)}
                      onToggleFavorite={() => toggleFavorite(component.id)}
                      onRemove={() => removeComponent(component.id)}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-1">No components found</h3>
                <p className="text-sm text-muted-foreground text-center max-w-xs mb-4">
                  {searchQuery 
                    ? "No components match your search query"
                    : selectedCategory === 'favorites'
                      ? "You haven't favorited any components yet"
                      : "No components in this category yet"
                  }
                </p>
                {!searchQuery && (
                  <Button variant="outline" size="sm" onClick={() => setSelectedCategory('all')}>
                    View all components
                  </Button>
                )}
              </div>
            )}
          </ScrollArea>
        </div>
      </Tabs>
    </div>
  );
};

export default ComponentLibrary;
