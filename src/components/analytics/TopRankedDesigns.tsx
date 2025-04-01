
import { Star } from "lucide-react";

const TopRankedDesigns = () => {
  // This would normally be fetched from your data source
  const topDesigns = [
    { title: "Modern Hero #2", count: 18, averageRank: 1.3 },
    { title: "Minimal About Section", count: 15, averageRank: 1.5 },
    { title: "Fixed Navbar", count: 12, averageRank: 1.8 },
    { title: "Sans-serif Font", count: 10, averageRank: 1.9 }
  ];

  return (
    <div className="space-y-3">
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
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopRankedDesigns;
