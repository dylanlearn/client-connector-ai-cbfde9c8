
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { BarChartHorizontal, Plus, Trash } from 'lucide-react';
import { getSuggestion } from '@/utils/copy-suggestions-helper';
import { CopySuggestions } from '@/services/ai/wireframe/wireframe-types';

// Define the StatItem type
interface StatItem {
  value: string;
  label: string;
  suffix?: string;
}

interface StatsSectionEditorProps {
  section: any;
  onUpdate: (updates: any) => void;
}

const StatsSectionEditor: React.FC<StatsSectionEditorProps> = ({ section, onUpdate }) => {
  // Parse stats from copySuggestions or use defaults
  const getStats = (): StatItem[] => {
    try {
      // Try to get stats as a string from copySuggestions
      const statsString = getSuggestion(section.copySuggestions, 'stats', '[]');
      
      // Parse the stats string to an array
      if (typeof statsString === 'string') {
        return JSON.parse(statsString);
      }
      
      // If stats is already an array on the copySuggestions object
      if (section.copySuggestions && 
          typeof section.copySuggestions === 'object' && 
          !Array.isArray(section.copySuggestions) &&
          Array.isArray(section.copySuggestions.stats)) {
        return section.copySuggestions.stats;
      }
      
      // Return default empty array if all else fails
      return [];
    } catch (e) {
      console.error("Error parsing stats:", e);
      return [];
    }
  };

  const [title, setTitle] = useState(getSuggestion(section.copySuggestions, 'title', 'Statistics & Metrics'));
  const [subtitle, setSubtitle] = useState(getSuggestion(section.copySuggestions, 'subtitle', 'Key performance indicators'));
  const [stats, setStats] = useState<StatItem[]>(getStats());

  useEffect(() => {
    setTitle(getSuggestion(section.copySuggestions, 'title', 'Statistics & Metrics'));
    setSubtitle(getSuggestion(section.copySuggestions, 'subtitle', 'Key performance indicators'));
    setStats(getStats());
  }, [section.copySuggestions]);

  const updateCopySuggestions = () => {
    const updatedCopySuggestions: Record<string, string> = {
      title,
      subtitle,
      // Store stats as JSON string
      stats: JSON.stringify(stats)
    };
    
    onUpdate({ copySuggestions: updatedCopySuggestions });
  };

  const addStat = () => {
    const newStats = [...stats, { value: '100', label: 'New Metric', suffix: '%' }];
    setStats(newStats);
    
    const updatedCopySuggestions: Record<string, string> = {
      title,
      subtitle,
      stats: JSON.stringify(newStats)
    };
    
    onUpdate({ copySuggestions: updatedCopySuggestions });
  };

  const updateStat = (index: number, field: keyof StatItem, value: string) => {
    const newStats = [...stats];
    newStats[index] = { ...newStats[index], [field]: value };
    setStats(newStats);
    
    const updatedCopySuggestions: Record<string, string> = {
      title,
      subtitle,
      stats: JSON.stringify(newStats)
    };
    
    onUpdate({ copySuggestions: updatedCopySuggestions });
  };

  const removeStat = (index: number) => {
    const newStats = stats.filter((_, i) => i !== index);
    setStats(newStats);
    
    const updatedCopySuggestions: Record<string, string> = {
      title,
      subtitle,
      stats: JSON.stringify(newStats)
    };
    
    onUpdate({ copySuggestions: updatedCopySuggestions });
  };

  return (
    <div className="space-y-6 p-4">
      <div className="grid gap-4">
        <div>
          <Label htmlFor="title">Section Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              const updatedCopySuggestions: Record<string, string> = {
                ...((typeof section.copySuggestions === 'object' && !Array.isArray(section.copySuggestions)) 
                  ? section.copySuggestions 
                  : {}),
                title: e.target.value,
                subtitle,
                stats: JSON.stringify(stats)
              };
              onUpdate({ copySuggestions: updatedCopySuggestions });
            }}
          />
        </div>
        <div>
          <Label htmlFor="subtitle">Section Subtitle</Label>
          <Input
            id="subtitle"
            value={subtitle}
            onChange={(e) => {
              setSubtitle(e.target.value);
              const updatedCopySuggestions: Record<string, string> = {
                ...((typeof section.copySuggestions === 'object' && !Array.isArray(section.copySuggestions)) 
                  ? section.copySuggestions 
                  : {}),
                title,
                subtitle: e.target.value,
                stats: JSON.stringify(stats)
              };
              onUpdate({ copySuggestions: updatedCopySuggestions });
            }}
          />
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Stats & Metrics</h3>
          <Button onClick={addStat} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Stat
          </Button>
        </div>

        <div className="space-y-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <BarChartHorizontal className="h-4 w-4 mr-2" />
                  Stat {index + 1}
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => removeStat(index)}
                >
                  <Trash className="h-4 w-4 text-destructive" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  <div>
                    <Label htmlFor={`value-${index}`}>Value</Label>
                    <Input 
                      id={`value-${index}`}
                      value={stat.value} 
                      onChange={(e) => updateStat(index, 'value', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`label-${index}`}>Label</Label>
                    <Input 
                      id={`label-${index}`}
                      value={stat.label} 
                      onChange={(e) => updateStat(index, 'label', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`suffix-${index}`}>Suffix (optional)</Label>
                    <Input 
                      id={`suffix-${index}`}
                      value={stat.suffix || ''} 
                      onChange={(e) => updateStat(index, 'suffix', e.target.value)}
                      placeholder="%"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {stats.length === 0 && (
            <Card>
              <CardContent className="text-center p-6 text-muted-foreground">
                <BarChartHorizontal className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p>No stats added yet. Click the button above to add your first stat.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsSectionEditor;
