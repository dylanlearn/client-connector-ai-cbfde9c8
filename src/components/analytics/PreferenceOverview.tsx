
import { Card } from "@/components/ui/card";

const PreferenceOverview = () => {
  // Simulated preference data
  const preferences = [
    { category: "Hero", percentage: 65 },
    { category: "Navbar", percentage: 40 },
    { category: "About", percentage: 80 },
    { category: "Footer", percentage: 55 },
    { category: "Font", percentage: 70 },
  ];

  return (
    <div className="space-y-3">
      {preferences.map((pref) => (
        <div key={pref.category} className="space-y-1">
          <div className="flex justify-between items-center text-sm">
            <span>{pref.category}</span>
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
