
import { Card } from "@/components/ui/card";
import { useAnalytics } from "@/hooks/use-analytics";

const PreferenceOverview = () => {
  const { getPreferenceOverview, isLoading, isRealtime } = useAnalytics();
  const preferences = getPreferenceOverview();

  if (isLoading) {
    return <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="space-y-1">
          <div className="flex justify-between items-center text-sm">
            <div className="h-4 w-20 bg-muted animate-pulse rounded"></div>
            <div className="h-4 w-10 bg-muted animate-pulse rounded"></div>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-muted animate-pulse"></div>
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

      {preferences.map((pref) => (
        <div key={pref.id} className="space-y-1">
          <div className="flex justify-between items-center text-sm">
            <span>{pref.category || pref.title || 'Unknown'}</span>
            <span className="text-muted-foreground">{pref.percentage}%</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#ee682b] via-[#8439e9] to-[#6142e7]" 
              style={{ width: `${pref.percentage}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default PreferenceOverview;
