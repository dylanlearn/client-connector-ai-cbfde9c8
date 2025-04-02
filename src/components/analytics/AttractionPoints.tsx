
import { CursorClick, MousePointer, Eye } from "lucide-react";

const AttractionPoints = () => {
  const attractionPoints = [
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

  const getIcon = (type: string) => {
    switch (type) {
      case "click":
        return <CursorClick className="h-4 w-4 text-blue-500" />;
      case "hover":
        return <MousePointer className="h-4 w-4 text-purple-500" />;
      case "attention":
        return <Eye className="h-4 w-4 text-amber-500" />;
      default:
        return null;
    }
  };

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
        <p>AI Suggestion: The hero CTA shows strong engagement - consider A/B testing variations to further optimize conversion.</p>
      </div>
    </div>
  );
};

export default AttractionPoints;
