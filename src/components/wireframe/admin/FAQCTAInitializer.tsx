
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { useComponentLibrary } from '@/hooks/use-component-library';
import { faqVariants } from '@/data/component-library-variants-faq';
import { ctaVariants } from '@/data/component-library-variants-cta';
import { Loader2 } from 'lucide-react';

const FAQCTAInitializer = () => {
  const { 
    isLoading,
    componentTypes,
    initializeFAQComponentLibrary,
    initializeCTAComponentLibrary
  } = useComponentLibrary();
  
  const [faqInitialized, setFaqInitialized] = useState(false);
  const [ctaInitialized, setCtaInitialized] = useState(false);

  const faqComponentExists = componentTypes.some(type => type.name === 'FAQ Section');
  const ctaComponentExists = componentTypes.some(type => type.name === 'CTA Section');

  const handleInitializeFAQ = async () => {
    const result = await initializeFAQComponentLibrary();
    if (result) {
      setFaqInitialized(true);
    }
  };

  const handleInitializeCTA = async () => {
    const result = await initializeCTAComponentLibrary();
    if (result) {
      setCtaInitialized(true);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>FAQ Component Library</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Available FAQ Variants:</h3>
              <p className="text-sm text-muted-foreground mb-2">
                {faqVariants?.length || 0} FAQ variants will be imported to the database
              </p>
              <div className="grid grid-cols-2 gap-2">
                {faqVariants?.slice(0, 4).map((variant, index) => (
                  <div key={index} className="border p-2 rounded-md text-xs">
                    {variant.variant}
                  </div>
                ))}
                {faqVariants && faqVariants.length > 4 && (
                  <div className="border p-2 rounded-md text-xs text-center">
                    +{faqVariants.length - 4} more
                  </div>
                )}
              </div>
            </div>

            <div className="bg-muted p-3 rounded-md">
              <h3 className="text-sm font-medium">Status:</h3>
              <p className="text-sm">
                {faqComponentExists || faqInitialized
                  ? '✅ FAQ component library is initialized in database' 
                  : '❌ FAQ component library not yet initialized in database'}
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleInitializeFAQ}
            disabled={isLoading || faqComponentExists || faqInitialized}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Initializing...
              </>
            ) : faqComponentExists || faqInitialized ? (
              'Already Initialized'
            ) : (
              'Initialize FAQ Component Library'
            )}
          </Button>
        </CardFooter>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>CTA Component Library</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Available CTA Variants:</h3>
              <p className="text-sm text-muted-foreground mb-2">
                {ctaVariants?.length || 0} CTA variants will be imported to the database
              </p>
              <div className="grid grid-cols-2 gap-2">
                {ctaVariants?.slice(0, 4).map((variant, index) => (
                  <div key={index} className="border p-2 rounded-md text-xs">
                    {variant.variant}
                  </div>
                ))}
                {ctaVariants && ctaVariants.length > 4 && (
                  <div className="border p-2 rounded-md text-xs text-center">
                    +{ctaVariants.length - 4} more
                  </div>
                )}
              </div>
            </div>

            <div className="bg-muted p-3 rounded-md">
              <h3 className="text-sm font-medium">Status:</h3>
              <p className="text-sm">
                {ctaComponentExists || ctaInitialized
                  ? '✅ CTA component library is initialized in database' 
                  : '❌ CTA component library not yet initialized in database'}
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleInitializeCTA}
            disabled={isLoading || ctaComponentExists || ctaInitialized}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Initializing...
              </>
            ) : ctaComponentExists || ctaInitialized ? (
              'Already Initialized'
            ) : (
              'Initialize CTA Component Library'
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default FAQCTAInitializer;
