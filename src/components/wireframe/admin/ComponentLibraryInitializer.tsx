
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { useComponentLibrary } from '@/hooks/use-component-library';
import { heroVariants } from '../registry/components/hero-components';
import { Loader2 } from 'lucide-react';

const ComponentLibraryInitializer = () => {
  const { 
    isLoading,
    componentTypes,
    initializeHeroComponentLibrary
  } = useComponentLibrary();
  
  const [isInitialized, setIsInitialized] = useState(false);

  const heroComponentExists = componentTypes.some(type => type.name === 'Hero Section');

  const handleInitialize = async () => {
    await initializeHeroComponentLibrary();
    setIsInitialized(true);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Component Library Database Initialization</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Database Structure:</h3>
            <ul className="list-disc pl-5 mt-2">
              <li>component_types - Store component definitions</li>
              <li>component_fields - Store field definitions for each component</li>
              <li>component_variants - Store variants of each component type</li>
              <li>component_styles - Store style tokens and configurations</li>
              <li>variant_styles - Store many-to-many relationships</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium">Available Hero Variants:</h3>
            <p className="text-sm text-muted-foreground mb-2">
              {heroVariants.length} hero variants will be imported to the database
            </p>
            <div className="grid grid-cols-3 gap-2">
              {heroVariants.slice(0, 6).map((variant, index) => (
                <div key={index} className="border p-2 rounded-md text-xs">
                  {variant.variant}
                </div>
              ))}
              {heroVariants.length > 6 && (
                <div className="border p-2 rounded-md text-xs text-center">
                  +{heroVariants.length - 6} more
                </div>
              )}
            </div>
          </div>

          <div className="bg-muted p-3 rounded-md">
            <h3 className="text-sm font-medium">Status:</h3>
            <p className="text-sm">
              {heroComponentExists 
                ? '✅ Hero component library is already initialized in database' 
                : '❌ Hero component library not yet initialized in database'}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleInitialize}
          disabled={isLoading || heroComponentExists || isInitialized}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Initializing...
            </>
          ) : heroComponentExists || isInitialized ? (
            'Already Initialized'
          ) : (
            'Initialize Hero Component Library'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ComponentLibraryInitializer;
