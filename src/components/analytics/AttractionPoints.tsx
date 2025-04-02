
import { MousePointerClick, MousePointer, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { fetchInteractionEvents } from "@/hooks/analytics/use-analytics-api";
import { Button } from "@/components/ui/button";

const AttractionPoints = () => {
  const { user } = useAuth();
  const [attractionPoints, setAttractionPoints] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  
  useEffect(() => {
    if (!user) return;
    
    const fetchAttractionData = async () => {
      setIsLoading(true);
      
      try {
        // Fetch click events
        const clickEvents = await fetchInteractionEvents(user.id, 'click');
        
        // Count events by element selector
        const elementCounts: Record<string, { count: number, type: string }> = {};
        
        clickEvents.forEach(event => {
          if (!event.element_selector) return;
          
          if (!elementCounts[event.element_selector]) {
            elementCounts[event.element_selector] = { 
              count: 0, 
              type: 'click' 
            };
          }
          
          elementCounts[event.element_selector].count += 1;
        });
        
        // Fetch hover events
        const hoverEvents = await fetchInteractionEvents(user.id, 'hover');
        
        hoverEvents.forEach(event => {
          if (!event.element_selector) return;
          
          if (!elementCounts[event.element_selector]) {
            elementCounts[event.element_selector] = { 
              count: 0, 
              type: 'hover' 
            };
          }
          
          // Hover events count less than clicks
          elementCounts[event.element_selector].count += 0.5;
        });
        
        // Convert to array and calculate scores
        const points = Object.entries(elementCounts).map(([element, data]) => {
          // Normalize score to 0-10 range
          const maxCount = Math.max(...Object.values(elementCounts).map(d => d.count));
          const score = maxCount > 0 ? (data.count / maxCount) * 10 : 0;
          
          // Clean up element name for display
          let displayName = element;
          
          // Convert selectors to friendlier names
          if (element.includes('#')) {
            displayName = element.split('#')[1].replace(/-/g, ' ');
          } else if (element.includes('.')) {
            displayName = element.split('.')[1].replace(/-/g, ' ');
          }
          
          // Capitalize words
          displayName = displayName
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
          
          return {
            element: displayName,
            score: Math.min(10, Math.round(score * 10) / 10),
            type: data.type
          };
        });
        
        // Sort by score and take top 4
        const topPoints = points
          .sort((a, b) => b.score - a.score)
          .slice(0, 4);
        
        setAttractionPoints(topPoints);
        
        // Generate AI suggestion based on top element
        if (topPoints.length > 0) {
          const topElement = topPoints[0].element;
          setAiSuggestion(`The ${topElement} shows strong engagement - consider A/B testing variations to further optimize conversion.`);
        }
      } catch (error) {
        console.error('Error fetching attraction points:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAttractionData();
  }, [user]);
  
  // If we don't have real data yet, show sample data
  if (attractionPoints.length === 0 && !isLoading) {
    const samplePoints = [
      { 
        element: "Hero CTA Button", 
        score: 9.4,
        type: "click" 
      },
      { 
        element: "Feature Image #2", 
        score: 8.7,
        type: "attention" 
      },
      { 
        element: "Pricing Table", 
        score: 7.8,
        type: "hover" 
      },
      { 
        element: "Testimonial Section", 
        score: 6.5,
        type: "attention" 
      },
    ];
    
    setAttractionPoints(samplePoints);
    setAiSuggestion("The hero CTA shows strong engagement - consider A/B testing variations to further optimize conversion.");
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "click":
        return <MousePointerClick className="h-4 w-4 text-blue-500" />;
      case "hover":
        return <MousePointer className="h-4 w-4 text-purple-500" />;
      case "attention":
        return <Eye className="h-4 w-4 text-amber-500" />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {attractionPoints.map((point, index) => (
        <div key={index} className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getIcon(point.type)}
            <span className="text-sm">{point.element}</span>
          </div>
          <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-400 to-purple-500" 
              style={{ width: `${(point.score / 10) * 100}%` }}
            />
          </div>
        </div>
      ))}
      
      <div className="pt-2 mt-2 border-t text-xs text-muted-foreground">
        <p>AI Suggestion: {aiSuggestion}</p>
      </div>
      
      <Button variant="ghost" size="sm" className="w-full text-xs mt-2">
        Get More AI Insights
      </Button>
    </div>
  );
};

export default AttractionPoints;
