
import { useState } from "react";
import { Edit, Save, Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { RankedDesignOption } from "@/hooks/use-design-selection";

interface RankedSelectionsProps {
  selectedDesigns: Record<string, RankedDesignOption>;
  setSelectedDesigns: React.Dispatch<React.SetStateAction<Record<string, RankedDesignOption>>>;
  categoryIcons: Record<string, JSX.Element>;
  handleRemoveDesign: (designId: string) => void;
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

  const startEditRank = (designId: string) => {
    setEditingRank(designId);
    setTempRank(selectedDesigns[designId]?.rank || null);
  };

  const startEditNotes = (designId: string) => {
    setEditingNotes(designId);
    setTempNotes(selectedDesigns[designId]?.notes || "");
  };

  const saveRank = () => {
    if (editingRank && tempRank) {
      const designWithSameRank = Object.entries(selectedDesigns).find(
        ([id, design]) => id !== editingRank && design.rank === tempRank
      );

      if (designWithSameRank) {
        const [swappedId, swappedDesign] = designWithSameRank;
        setSelectedDesigns(prev => ({
          ...prev,
          [editingRank]: {
            ...prev[editingRank],
            rank: tempRank
          },
          [swappedId]: {
            ...prev[swappedId],
            rank: prev[editingRank]?.rank || null
          }
        }));
        
        toast.info(`Swapped rank ${tempRank} between selections`);
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

  // Group by category for better organization
  const designsByCategory: Record<string, Array<[string, RankedDesignOption]>> = {};
  Object.entries(selectedDesigns).forEach(([id, design]) => {
    if (!designsByCategory[design.category]) {
      designsByCategory[design.category] = [];
    }
    designsByCategory[design.category].push([id, design]);
  });

  const totalSelections = Object.values(selectedDesigns).length;

  if (totalSelections === 0) {
    return null;
  }

  return (
    <div className="mt-8 p-4 border rounded-lg bg-muted/50">
      <h3 className="font-medium mb-4">Your Selections ({totalSelections}):</h3>
      
      {Object.entries(designsByCategory).map(([category, designs]) => (
        <div key={category} className="mb-6">
          <h4 className="text-sm font-medium capitalize mb-2 flex items-center">
            {categoryIcons[category as keyof typeof categoryIcons]}
            <span className="ml-2">{category} Selections ({designs.length})</span>
          </h4>
          
          <div className="space-y-3">
            {designs.map(([designId, design]) => (
              <div key={designId} className="bg-background rounded border overflow-hidden">
                <div className="flex items-center border-b p-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{design.title}</p>
                  </div>
                  
                  <div className="flex items-center ml-4">
                    {editingRank === designId ? (
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
                        <Button size="icon" variant="ghost" onClick={() => startEditRank(designId)} className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    
                    <Button size="icon" variant="ghost" className="text-red-500 h-8 w-8 ml-2" onClick={() => handleRemoveDesign(designId)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="p-3 bg-muted/30">
                  {editingNotes === designId ? (
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
                          <Button size="icon" variant="ghost" onClick={() => startEditNotes(designId)} className="h-8 w-8 ml-2 flex-shrink-0">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button variant="ghost" size="sm" onClick={() => startEditNotes(designId)} className="text-sm">
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
      ))}
    </div>
  );
};

export default RankedSelections;
