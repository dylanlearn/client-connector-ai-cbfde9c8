
import { ArrowUpRight, ArrowDownRight, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

const ABTestResults = () => {
  const testResults = [
    {
      name: "Hero Section Layout",
      variants: [
        { name: "Variant A (Control)", convRate: 3.2, isWinner: false },
        { name: "Variant B (Image Left)", convRate: 4.8, isWinner: true, improvement: 50 }
      ],
      status: "Completed",
      confidence: 98,
      date: "Aug 15 - Sep 02"
    },
    {
      name: "CTAs Color Test",
      variants: [
        { name: "Variant A (Blue)", convRate: 2.7, isWinner: false },
        { name: "Variant B (Green)", convRate: 2.5, isWinner: false },
        { name: "Variant C (Orange)", convRate: 3.1, isWinner: true, improvement: 15 }
      ],
      status: "Completed",
      confidence: 92,
      date: "Jul 24 - Aug 12"
    },
    {
      name: "Pricing Table Format",
      variants: [
        { name: "Variant A (Simple)", convRate: 1.8, isWinner: false },
        { name: "Variant B (Detailed)", convRate: 1.9, isWinner: true, improvement: 5 }
      ],
      status: "Active",
      confidence: 68,
      date: "Sep 03 - Current"
    }
  ];

  return (
    <div className="space-y-6">
      {testResults.map((test, index) => (
        <div key={index} className={`pb-6 ${index < testResults.length - 1 ? 'border-b' : ''}`}>
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-medium">{test.name}</h3>
              <div className="flex items-center text-sm text-muted-foreground">
                <span>{test.date}</span>
                <span className="mx-2">•</span>
                <span className={`font-medium ${test.status === 'Completed' ? 'text-green-600' : 'text-amber-600'}`}>
                  {test.status}
                </span>
                {test.status === 'Completed' && (
                  <>
                    <span className="mx-2">•</span>
                    <span>{test.confidence}% confidence</span>
                  </>
                )}
              </div>
            </div>
            <Button variant="ghost" size="sm">
              <BarChart3 className="h-4 w-4 mr-1" />
              Details
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {test.variants.map((variant, vIndex) => (
              <div 
                key={vIndex}
                className={`border rounded-md p-3 ${variant.isWinner ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">{variant.name}</span>
                  {variant.isWinner && (
                    <span className="text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded">Winner</span>
                  )}
                </div>
                <div className="flex items-baseline">
                  <span className="text-2xl font-semibold">{variant.convRate}%</span>
                  <span className="text-sm ml-1">conversion</span>
                  
                  {variant.improvement && (
                    <div className="flex items-center ml-2 text-xs text-green-600">
                      <ArrowUpRight className="h-3 w-3 mr-0.5" />
                      {variant.improvement}%
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {test.status === 'Completed' && (
            <div className="mt-3 text-sm text-muted-foreground bg-blue-50 border border-blue-100 rounded-md p-2">
              <span className="font-medium text-blue-700">AI Insight:</span> The winning variant performed better because it aligned more closely with user expectations and reduced cognitive load.
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ABTestResults;
