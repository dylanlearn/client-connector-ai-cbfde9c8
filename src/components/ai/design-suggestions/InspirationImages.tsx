
import React from "react";
import { ImageIcon } from "lucide-react";

interface InspirationImagesProps {
  components: string[];
  style?: string;
}

const InspirationImages = ({ components, style }: InspirationImagesProps) => {
  if (!components || components.length === 0) {
    return null;
  }
  
  // These are placeholder images that represent different design styles
  // In a production app, you'd generate or fetch relevant images
  const getImageForCategory = (text: string, index: number): string => {
    // Simple logic to get a somewhat related placeholder image
    const categories = [
      'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=300&h=200&fit=crop',
      'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=300&h=200&fit=crop',
      'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=300&h=200&fit=crop',
      'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&h=200&fit=crop',
      'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=300&h=200&fit=crop'
    ];
    
    // Try to match image based on component type
    if (/header|navigation|menu/i.test(text)) return categories[0];
    if (/hero|banner|showcase/i.test(text)) return categories[1];
    if (/card|grid|gallery/i.test(text)) return categories[2];
    if (/footer|contact|form/i.test(text)) return categories[3];
    
    // Fallback to index-based selection
    return categories[index % categories.length];
  };
  
  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-2">Visual Inspiration</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {components.slice(0, 6).map((component, index) => (
          <div 
            key={index} 
            className="border rounded-md overflow-hidden bg-background"
          >
            <div className="relative h-36 bg-muted">
              <img 
                src={getImageForCategory(component, index)} 
                alt={`Inspiration for ${component.substring(0, 20)}...`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback if image fails to load
                  e.currentTarget.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>';
                  e.currentTarget.classList.add('bg-muted-foreground/10');
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-background/80 p-2">
                <p className="text-xs font-medium truncate">
                  {component.substring(0, 40)}{component.length > 40 ? '...' : ''}
                </p>
              </div>
            </div>
          </div>
        ))}
        
        {components.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-8 text-muted-foreground">
            <ImageIcon className="h-10 w-10 mb-2" />
            <p>No inspiration images available for this design style.</p>
          </div>
        )}
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        Note: Images shown are illustrative examples to inspire design direction.
      </p>
    </div>
  );
};

export default InspirationImages;
