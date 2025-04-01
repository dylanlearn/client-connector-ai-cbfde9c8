
import { useState } from "react";
import { Edit, Save, Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { DesignOption } from "./VisualPicker";

type RankedDesignOption = DesignOption & {
  rank?: number;
  notes?: string;
};

interface RankedSelectionsProps {
  selectedDesigns: Record<string, RankedDesignOption>;
  setSelectedDesigns: React.Dispatch<React.SetStateAction<Record<string, RankedDesignOption>>>;
  categoryIcons: Record<string, JSX.Element>;
  handleRemoveDesign: (category: string) => void;
}

const RankedSelections = ({ 
  selectedDesigns, 
  setSelectedDesigns, 
  categoryIcons, 
  handleRemoveDesign 
}: RankedSelectionsProps) => {
  const [editingRank, setEditingRank] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [tempRank, setTempRank] = useState<number | null>(null);
  const [tempNotes, setTempNotes] = useState<string>("");

  const usedRanks = Object.values(selectedDesigns)
    .map(design => design.rank)
    .filter(rank => !!rank) as number[];

  const startEditRank = (category: string) => {
    setEditingRank(category);
    setTempRank(selectedDesigns[category]?.rank || null);
  };

  const startEditNotes = (category: string) => {
    setEditingNotes(category);
    setTempNotes(selectedDesigns[category]?.notes || "");
  };

  const saveRank = () => {
    if (editingRank && tempRank) {
      const designWithSameRank = Object.entries(selectedDesigns).find(
        ([cat, design]) => cat !== editingRank && design.rank === tempRank
      );

      if (designWithSameRank) {
        const [swappedCategory, swappedDesign] = designWithSameRank;
        setSelectedDesigns(prev => ({
          ...prev,
          [editingRank]: {
            ...prev[editingRank],
            rank: tempRank
          },
          [swappedCategory]: {
            ...prev[swappedCategory],
            rank: prev[editingRank]?.rank || null
          }
        }));
        
        toast.info(`Swapped rank ${tempRank} between ${editingRank} and ${swappedCategory}`);
      } else {
        setSelectedDesigns(prev => ({
          ...prev,
          [editingRank]: {
            ...prev[editingRank],
            rank: tempRank
          }
        }));
      }
    }
    setEditingRank(null);
    setTempRank(null);
  };

  const saveNotes = () => {
    if (editingNotes) {
      setSelectedDesigns(prev => ({
        ...prev,
        [editingNotes]: {
          ...prev[editingNotes],
          notes: tempNotes
        }
      }));
    }
    setEditingNotes(null);
    setTempNotes("");
  };

  const completedCategories = Object.keys(selectedDesigns).length;

  if (completedCategories === 0) {
    return null;
  }

  return (
    <div className="mt-8 p-4 border rounded-lg bg-muted/50">
      <h3 className="font-medium mb-4">Your Ranked Selections ({completedCategories}/4):</h3>
      <div className="space-y-4">
        {Object.entries(selectedDesigns).map(([category, design]) => (
          <div key={design.id} className="bg-background rounded border overflow-hidden">
            <div className="flex items-center border-b p-2">
              <div className="w-10 h-10 flex items-center justify-center bg-primary/10 rounded mr-3">
                {categoryIcons[category as keyof typeof categoryIcons]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{design.title}</p>
                <p className="text-xs text-muted-foreground capitalize">{category}</p>
              </div>
              
              <div className="flex items-center ml-4">
                {editingRank === category ? (
                  <div className="flex items-center gap-2">
                    <select 
                      value={tempRank || ""} 
                      onChange={(e) => setTempRank(parseInt(e.target.value))}
                      className="w-16 h-8 rounded border px-2 text-sm"
                    >
                      <option value="">Rank</option>
                      {[1, 2, 3, 4].map(rank => (
                        <option 
                          key={rank} 
                          value={rank}
                          disabled={usedRanks.includes(rank) && design.rank !== rank}
                        >
                          {rank}
                        </option>
                      ))}
                    </select>
                    <Button size="icon" variant="ghost" onClick={saveRank} className="h-8 w-8">
                      <Save className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center">
                    {design.rank ? (
                      <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded mr-2">
                        <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                        <span className="font-bold">{design.rank}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground mr-2">Not ranked</span>
                    )}
                    <Button size="icon" variant="ghost" onClick={() => startEditRank(category)} className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                
                <Button size="icon" variant="ghost" className="text-red-500 h-8 w-8 ml-2" onClick={() => handleRemoveDesign(category)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="p-3 bg-muted/30">
              {editingNotes === category ? (
                <div className="space-y-2">
                  <Textarea 
                    placeholder="Add notes about this design..." 
                    value={tempNotes}
                    onChange={(e) => setTempNotes(e.target.value)}
                    className="min-h-[80px] text-sm"
                  />
                  <div className="flex justify-end">
                    <Button size="sm" variant="outline" onClick={() => setEditingNotes(null)} className="mr-2">
                      Cancel
                    </Button>
                    <Button size="sm" onClick={saveNotes}>
                      Save Notes
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  {design.notes ? (
                    <div className="flex justify-between items-start">
                      <p className="text-sm whitespace-pre-line">{design.notes}</p>
                      <Button size="icon" variant="ghost" onClick={() => startEditNotes(category)} className="h-8 w-8 ml-2 flex-shrink-0">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button variant="ghost" size="sm" onClick={() => startEditNotes(category)} className="text-sm">
                      <Edit className="h-3 w-3 mr-1" />
                      Add Notes
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RankedSelections;
