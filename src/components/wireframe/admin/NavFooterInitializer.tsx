
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { useComponentLibrary } from '@/hooks/use-component-library';
import { navigationVariants } from '@/data/component-library-variants-navigation';
import { footerVariants } from '@/data/component-library-variants-footer';
import { Loader2 } from 'lucide-react';

const NavFooterInitializer = () => {
  const { 
    isLoading,
    componentTypes,
    initializeNavigationComponentLibrary,
    initializeFooterComponentLibrary
  } = useComponentLibrary();
  
  const [navInitialized, setNavInitialized] = useState(false);
  const [footerInitialized, setFooterInitialized] = useState(false);

  const navComponentExists = componentTypes.some(type => type.name === 'Navigation');
  const footerComponentExists = componentTypes.some(type => type.name === 'Footer');

  const handleInitializeNavigation = async () => {
    const result = await initializeNavigationComponentLibrary();
    if (result) {
      setNavInitialized(true);
    }
  };

  const handleInitializeFooter = async () => {
    const result = await initializeFooterComponentLibrary();
    if (result) {
      setFooterInitialized(true);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Navigation Component Library</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Available Navigation Variants:</h3>
              <p className="text-sm text-muted-foreground mb-2">
                {navigationVariants?.length || 0} Navigation variants will be imported to the database
              </p>
              <div className="grid grid-cols-2 gap-2">
                {navigationVariants?.slice(0, 4).map((variant, index) => (
                  <div key={index} className="border p-2 rounded-md text-xs">
                    {variant.variant}
                  </div>
                ))}
                {navigationVariants && navigationVariants.length > 4 && (
                  <div className="border p-2 rounded-md text-xs text-center">
                    +{navigationVariants.length - 4} more
                  </div>
                )}
              </div>
            </div>

            <div className="bg-muted p-3 rounded-md">
              <h3 className="text-sm font-medium">Status:</h3>
              <p className="text-sm">
                {navComponentExists || navInitialized
                  ? '✅ Navigation component library is initialized in database' 
                  : '❌ Navigation component library not yet initialized in database'}
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleInitializeNavigation}
            disabled={isLoading || navComponentExists || navInitialized}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Initializing...
              </>
            ) : navComponentExists || navInitialized ? (
              'Already Initialized'
            ) : (
              'Initialize Navigation Component Library'
            )}
          </Button>
        </CardFooter>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Footer Component Library</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Available Footer Variants:</h3>
              <p className="text-sm text-muted-foreground mb-2">
                {footerVariants?.length || 0} Footer variants will be imported to the database
              </p>
              <div className="grid grid-cols-2 gap-2">
                {footerVariants?.slice(0, 4).map((variant, index) => (
                  <div key={index} className="border p-2 rounded-md text-xs">
                    {variant.variant}
                  </div>
                ))}
                {footerVariants && footerVariants.length > 4 && (
                  <div className="border p-2 rounded-md text-xs text-center">
                    +{footerVariants.length - 4} more
                  </div>
                )}
              </div>
            </div>

            <div className="bg-muted p-3 rounded-md">
              <h3 className="text-sm font-medium">Status:</h3>
              <p className="text-sm">
                {footerComponentExists || footerInitialized
                  ? '✅ Footer component library is initialized in database' 
                  : '❌ Footer component library not yet initialized in database'}
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleInitializeFooter}
            disabled={isLoading || footerComponentExists || footerInitialized}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Initializing...
              </>
            ) : footerComponentExists || footerInitialized ? (
              'Already Initialized'
            ) : (
              'Initialize Footer Component Library'
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NavFooterInitializer;
