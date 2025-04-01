
import { Star } from "lucide-react";
import { useAnalytics } from "@/hooks/use-analytics";

const TopRankedDesigns = () => {
  const { getTopRankedDesigns, isLoading, isRealtime } = useAnalytics();
  const topDesigns = getTopRankedDesigns(4);

  if (isLoading) {
    return <div className="space-y-3">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center justify-between pb-3 border-b last:border-0 last:pb-0">
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 bg-muted animate-pulse rounded-full"></div>
            <div className="h-4 w-32 bg-muted animate-pulse rounded"></div>
          </div>
          <div className="flex items-center">
            <div className="h-4 w-10 bg-muted animate-pulse rounded"></div>
          </div>
        </div>
      ))}
    </div>;
  }

  return (
    <div className="space-y-3">
      {isRealtime && (
        <div className="text-xs text-muted-foreground mb-2 flex items-center">
          <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
          Live data
        </div>
      )}

      {topDesigns.map((design, index) => (
        <div key={index} className="flex items-center justify-between pb-3 border-b last:border-0 last:pb-0">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-amber-400 to-amber-500 text-white h-6 w-6 flex items-center justify-center rounded-full text-xs font-bold">
              {index + 1}
            </div>
            <span className="font-medium text-sm">{design.title}</span>
          </div>
          <div className="flex items-center">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500 mr-1.5" />
            <span className="text-sm">{design.averageRank.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground ml-2">({design.count}×)</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopRankedDesigns;
