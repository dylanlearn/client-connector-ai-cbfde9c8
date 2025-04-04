
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DesignMemoryService, DesignMemoryEntry } from '@/services/ai/design/design-memory-service';
import { Badge } from '@/components/ui/badge';
import { Check, Heart, ThumbsDown, ThumbsUp } from 'lucide-react';

interface AIDesignSuggestionDemoProps {
  isActive: boolean;
}

export const AIDesignSuggestionDemo: React.FC<AIDesignSuggestionDemoProps> = ({ isActive }) => {
  const [designEntries, setDesignEntries] = useState<DesignMemoryEntry[]>([]);
  const [currentEntryIndex, setCurrentEntryIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<'liked' | 'disliked' | null>(null);

  useEffect(() => {
    if (isActive) {
      fetchDesignEntries();
    }
  }, [isActive]);

  const fetchDesignEntries = async () => {
    setIsLoading(true);
    try {
      // Simulate fetching design entries
      // In a real app, this would come from an API
      const mockEntries: DesignMemoryEntry[] = [
        {
          title: "Modern Hero Section",
          category: "layout-hero",
          subcategory: "hero",
          description: "Clean, modern hero section with gradient background and centered content",
          visual_elements: {
            layout: "Centered content with clear hierarchy",
            color_scheme: "Blue gradient with high contrast",
            typography: "Large, bold sans-serif headings",
            spacing: "Generous whitespace",
            imagery: "Abstract shapes and illustrations"
          },
          color_scheme: {
            primary: "Blue",
            secondary: "Purple",
            accent: "Teal",
            background: "Gradient",
            text: "White"
          },
          typography: {
            headings: "Sans-serif, bold",
            body: "Light sans-serif",
            accent: "Medium weight",
            size_scale: "1.25 ratio"
          },
          layout_pattern: {
            type: "Centered",
            grid: "12-column grid",
            responsive: true,
            components: ["Headline", "Subheading", "CTA Button"]
          },
          tags: ["modern", "clean", "hero", "gradient"],
          source_url: "https://example.com",
          image_url: "",
          relevance_score: 0.92
        },
        {
          title: "Feature Grid Layout",
          category: "layout-features",
          subcategory: "features",
          description: "Three column grid for showcasing product features with icons",
          visual_elements: {
            layout: "Three column grid layout",
            color_scheme: "Monochromatic with accent color",
            typography: "Medium size headings with small descriptive text",
            spacing: "Equal spacing between elements",
            imagery: "Simple line icons"
          },
          color_scheme: {
            primary: "Navy",
            secondary: "Light blue",
            accent: "Orange",
            background: "White",
            text: "Dark gray"
          },
          typography: {
            headings: "Medium weight sans-serif",
            body: "Regular weight sans-serif",
            accent: "Semibold",
            size_scale: "1.2 ratio"
          },
          layout_pattern: {
            type: "Grid",
            grid: "Three column",
            responsive: true,
            components: ["Icon", "Feature name", "Description"]
          },
          tags: ["features", "grid", "icons", "product"],
          source_url: "https://example.com/features",
          image_url: "",
          relevance_score: 0.85
        }
      ];
      
      setDesignEntries(mockEntries);
    } catch (error) {
      console.error("Error fetching design entries:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = () => {
    setFeedback('liked');
    // In a real app, this would send feedback to the API
    console.log("Design suggestion liked:", designEntries[currentEntryIndex]?.title);
  };

  const handleDislike = () => {
    setFeedback('disliked');
    // In a real app, this would send feedback to the API
    console.log("Design suggestion disliked:", designEntries[currentEntryIndex]?.title);
  };

  const handleNextSuggestion = () => {
    setFeedback(null);
    setCurrentEntryIndex((prevIndex) => 
      prevIndex < designEntries.length - 1 ? prevIndex + 1 : 0
    );
  };

  if (isLoading || designEntries.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground text-sm">Loading design suggestions...</p>
      </div>
    );
  }

  const currentEntry = designEntries[currentEntryIndex];

  return (
    <div className="h-full flex flex-col justify-center">
      <motion.div 
        className="w-full max-w-md mx-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex justify-between items-center">
              <span>{currentEntry.title}</span>
              <Badge variant="outline" className="ml-2">{currentEntry.category}</Badge>
            </CardTitle>
            <p className="text-sm text-muted-foreground">{currentEntry.description}</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Visual Elements</h4>
                <ul className="text-sm space-y-1">
                  <li><span className="font-medium">Layout:</span> {currentEntry.visual_elements.layout}</li>
                  <li><span className="font-medium">Colors:</span> {currentEntry.visual_elements.color_scheme}</li>
                  <li><span className="font-medium">Typography:</span> {currentEntry.visual_elements.typography}</li>
                </ul>
              </div>
              
              <div className="flex flex-wrap gap-1 pt-2">
                {currentEntry.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                ))}
              </div>
              
              {!feedback ? (
                <div className="flex justify-center space-x-4 pt-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex items-center" 
                    onClick={handleDislike}
                  >
                    <ThumbsDown className="h-4 w-4 mr-1" />
                    Not for me
                  </Button>
                  <Button 
                    size="sm" 
                    variant="default" 
                    className="flex items-center" 
                    onClick={handleLike}
                  >
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    I like this
                  </Button>
                </div>
              ) : (
                <div className="pt-2">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="bg-muted p-2 rounded-md text-center mb-2">
                      <p className="text-sm flex items-center justify-center">
                        <Check className="h-4 w-4 mr-1 text-green-500" />
                        {feedback === 'liked' ? 'Thanks! We\'ll remember your preference.' : 'Feedback recorded. We\'ll show you different options.'}
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full" 
                      onClick={handleNextSuggestion}
                    >
                      View next suggestion
                    </Button>
                  </motion.div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AIDesignSuggestionDemo;
