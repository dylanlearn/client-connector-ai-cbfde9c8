
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, Star } from "lucide-react";
import { useState, useEffect } from "react";

const TipsTab = () => {
  const [tips, setTips] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const loadTips = async () => {
      setIsLoading(true);
      try {
        // Mock data - in a real app this would come from an API
        setTimeout(() => {
          setTips([
            {
              id: '1',
              title: 'Optimize Your Design Process',
              content: 'Use consistent components and design tokens to speed up your workflow and maintain design consistency across projects.',
              category: 'design',
              isStarred: true
            },
            {
              id: '2',
              title: 'Improve Client Communication',
              content: 'Regular updates and clear feedback channels can significantly improve client satisfaction and project outcomes.',
              category: 'client',
              isStarred: false
            },
            {
              id: '3',
              title: 'Leverage AI Tools',
              content: 'AI can help with repetitive tasks, generate initial design concepts, and provide data-driven insights for better decision making.',
              category: 'tools',
              isStarred: false
            }
          ]);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error loading tips", error);
        setIsLoading(false);
      }
    };
    
    loadTips();
  }, []);

  const toggleStar = (tipId: string) => {
    setTips(tips.map(tip => 
      tip.id === tipId ? { ...tip, isStarred: !tip.isStarred } : tip
    ));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          <>
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-2">
                  <CardTitle className="bg-gray-200 h-6 w-3/4 rounded"></CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-200 h-4 w-full rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 w-5/6 rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 w-4/6 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          tips.map(tip => (
            <Card key={tip.id}>
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  {tip.title}
                </CardTitle>
                <button 
                  className="text-muted-foreground hover:text-yellow-400"
                  onClick={() => toggleStar(tip.id)}
                >
                  <Star 
                    className={`h-5 w-5 ${tip.isStarred ? 'fill-yellow-400 text-yellow-400' : ''}`} 
                  />
                </button>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p>{tip.content}</p>
                <div className="mt-2">
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                    {tip.category}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default TipsTab;
