
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useResponsive } from '@/contexts/ResponsiveContext';
import { Badge } from '@/components/ui/badge';

interface ResponsiveShowcaseProps {
  className?: string;
}

const ResponsiveShowcase: React.FC<ResponsiveShowcaseProps> = ({ className }) => {
  const responsive = useResponsive();
  const { 
    currentBreakpoint, 
    isExtraSmall, 
    isSmall, 
    isMedium,
    isLarge,
    isExtraLarge,
    is2XL,
    viewportWidth,
    viewportHeight
  } = responsive;

  // Derived properties for showcase
  const isDesktop = isLarge || isExtraLarge || is2XL;
  const isTablet = isMedium;
  const isMobile = isExtraSmall || isSmall;
  const orientation = viewportWidth > viewportHeight ? 'landscape' : 'portrait';
  const devicePixelRatio = typeof window !== 'undefined' ? window.devicePixelRatio : 1;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Responsive System Showcase</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Current Breakpoint</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant={currentBreakpoint === 'xs' ? "default" : "outline"}>xs</Badge>
              <Badge variant={currentBreakpoint === 'sm' ? "default" : "outline"}>sm</Badge>
              <Badge variant={currentBreakpoint === 'md' ? "default" : "outline"}>md</Badge>
              <Badge variant={currentBreakpoint === 'lg' ? "default" : "outline"}>lg</Badge>
              <Badge variant={currentBreakpoint === 'xl' ? "default" : "outline"}>xl</Badge>
              <Badge variant={currentBreakpoint === '2xl' ? "default" : "outline"}>2xl</Badge>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Device Type</h3>
            <div className="flex gap-2">
              <Badge variant={isMobile ? "default" : "outline"}>Mobile</Badge>
              <Badge variant={isTablet ? "default" : "outline"}>Tablet</Badge>
              <Badge variant={isDesktop ? "default" : "outline"}>Desktop</Badge>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Screen Properties</h3>
            <ul className="space-y-1">
              <li><span className="font-medium">Viewport:</span> {viewportWidth}×{viewportHeight}px</li>
              <li><span className="font-medium">Orientation:</span> {orientation}</li>
              <li><span className="font-medium">Pixel Ratio:</span> {devicePixelRatio.toFixed(2)}x</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Responsive Demo</h3>
            <div className="grid gap-4">
              <div className="hidden sm:block">This is visible on sm screens and up</div>
              <div className="hidden md:block">This is visible on md screens and up</div>
              <div className="hidden lg:block">This is visible on lg screens and up</div>
              <div className="block sm:hidden">This is only visible on xs screens</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResponsiveShowcase;
