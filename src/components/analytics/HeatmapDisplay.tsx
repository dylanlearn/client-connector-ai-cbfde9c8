
import { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const HeatmapDisplay = () => {
  const [selectedPage, setSelectedPage] = useState("homepage");
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            AI-Enhanced
          </Badge>
          <span className="text-sm text-muted-foreground">Updated 2 hours ago</span>
        </div>
        
        <Select defaultValue={selectedPage} onValueChange={setSelectedPage}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select page" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="homepage">Homepage</SelectItem>
            <SelectItem value="about">About Us</SelectItem>
            <SelectItem value="pricing">Pricing</SelectItem>
            <SelectItem value="contact">Contact</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="relative border rounded-md aspect-video overflow-hidden bg-white">
        {/* This would be replaced with actual heatmap visualization */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50">
          {/* Sample click data points */}
          <div className="absolute top-1/4 left-1/4 h-16 w-16 rounded-full bg-red-500 opacity-30 blur-xl"></div>
          <div className="absolute top-1/3 left-1/2 h-24 w-24 rounded-full bg-red-500 opacity-40 blur-xl"></div>
          <div className="absolute top-2/3 left-1/3 h-20 w-20 rounded-full bg-orange-500 opacity-30 blur-xl"></div>
        </div>
        <div className="absolute inset-0 flex justify-center items-center">
          <div className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Mockup of heatmap visualization</p>
            <p className="text-xs text-muted-foreground">In production, this will display actual user interaction data</p>
          </div>
        </div>
      </div>
      
      <div className="text-sm mt-2">
        <p className="text-muted-foreground">
          <span className="font-medium text-foreground">AI Insight:</span> Users spend 67% more time focused on the hero section compared to other areas. Consider emphasizing your key value proposition here.
        </p>
      </div>
    </div>
  );
};

export default HeatmapDisplay;
