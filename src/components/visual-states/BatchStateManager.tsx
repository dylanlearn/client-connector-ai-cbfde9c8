
import React, { useState, useCallback } from 'react';
import { ComponentState, useVisualState } from '@/contexts/VisualStateContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Search, Plus, Trash, Play, Save } from 'lucide-react';

interface BatchStateSequence {
  id: string;
  name: string;
  states: ComponentState[];
  duration?: number;
  delay?: number;
}

interface BatchStateManagerProps {
  title?: string;
  className?: string;
}

/**
 * A component for managing batches of component states and sequences
 * Allows defining and running state transition sequences
 */
export const BatchStateManager: React.FC<BatchStateManagerProps> = ({
  title = 'Batch State Manager',
  className
}) => {
  const { setPreviewState, setTransitionDuration, setTransitionDelay } = useVisualState();
  
  // Sample initial sequences
  const [sequences, setSequences] = useState<BatchStateSequence[]>([
    {
      id: '1',
      name: 'Button Click',
      states: ['hover', 'active', 'hover', 'default'],
      duration: 200,
      delay: 0
    },
    {
      id: '2',
      name: 'Form Focus',
      states: ['default', 'focus', 'default'],
      duration: 300,
      delay: 50
    },
    {
      id: '3',
      name: 'Disabled Feedback',
      states: ['default', 'disabled', 'default'],
      duration: 500,
      delay: 0
    }
  ]);
  
  const [currentSequence, setCurrentSequence] = useState<string>(sequences[0].id);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newSequenceName, setNewSequenceName] = useState('');
  
  // Find the active sequence
  const activeSequence = sequences.find(seq => seq.id === currentSequence) || sequences[0];
  
  // Filter sequences by search query
  const filteredSequences = searchQuery
    ? sequences.filter(seq => seq.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : sequences;
  
  // Play a state sequence
  const playSequence = useCallback((sequence: BatchStateSequence) => {
    if (isPlaying) return;
    setIsPlaying(true);
    
    const { states, duration = 300, delay = 0 } = sequence;
    setTransitionDuration(duration);
    setTransitionDelay(delay);
    
    let currentIndex = 0;
    
    // Set the first state immediately
    setPreviewState(states[currentIndex]);
    currentIndex++;
    
    // Set an interval to cycle through the remaining states
    const interval = setInterval(() => {
      if (currentIndex < states.length) {
        setPreviewState(states[currentIndex]);
        currentIndex++;
      } else {
        clearInterval(interval);
        setIsPlaying(false);
      }
    }, duration + delay + 100); // Add extra time to ensure animations complete
    
    return () => clearInterval(interval);
  }, [isPlaying, setPreviewState, setTransitionDuration, setTransitionDelay]);
  
  // Add a new sequence
  const addSequence = useCallback(() => {
    if (!newSequenceName) return;
    
    const newSequence: BatchStateSequence = {
      id: Date.now().toString(),
      name: newSequenceName,
      states: ['default', 'hover', 'default'],
      duration: 300,
      delay: 0
    };
    
    setSequences(prev => [...prev, newSequence]);
    setCurrentSequence(newSequence.id);
    setNewSequenceName('');
  }, [newSequenceName]);
  
  // Delete a sequence
  const deleteSequence = useCallback((id: string) => {
    setSequences(prev => prev.filter(seq => seq.id !== id));
    
    if (currentSequence === id && sequences.length > 1) {
      setCurrentSequence(sequences[0].id);
    }
  }, [currentSequence, sequences]);
  
  // Update the current sequence
  const updateCurrentSequence = useCallback((updates: Partial<BatchStateSequence>) => {
    setSequences(prev => prev.map(seq => 
      seq.id === currentSequence ? { ...seq, ...updates } : seq
    ));
  }, [currentSequence]);
  
  // Add a state to the current sequence
  const addStateToSequence = useCallback((state: ComponentState) => {
    updateCurrentSequence({
      states: [...(activeSequence.states || []), state]
    });
  }, [activeSequence.states, updateCurrentSequence]);
  
  // Remove a state from the current sequence
  const removeStateFromSequence = useCallback((index: number) => {
    updateCurrentSequence({
      states: activeSequence.states.filter((_, i) => i !== index)
    });
  }, [activeSequence.states, updateCurrentSequence]);
  
  return (
    <Card className={cn("batch-state-manager", className)}>
      <CardHeader className="p-3 pb-0">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      
      <CardContent className="p-3">
        <Tabs defaultValue="sequences">
          <TabsList className="mb-3">
            <TabsTrigger value="sequences">Sequences</TabsTrigger>
            <TabsTrigger value="editor">Sequence Editor</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sequences">
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground/70" />
                <Input
                  placeholder="Search sequences..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              
              <div className="space-y-2 max-h-60 overflow-auto pr-1">
                {filteredSequences.length === 0 ? (
                  <div className="text-center py-4 text-sm text-muted-foreground">
                    No sequences found
                  </div>
                ) : (
                  filteredSequences.map(sequence => (
                    <div 
                      key={sequence.id}
                      className={cn(
                        "p-2 border rounded-md flex justify-between items-center",
                        currentSequence === sequence.id ? "border-primary bg-primary/10" : "hover:bg-accent"
                      )}
                      onClick={() => setCurrentSequence(sequence.id)}
                    >
                      <div>
                        <div className="font-medium">{sequence.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {sequence.states.map(s => s.charAt(0).toUpperCase()).join(' → ')}
                          {sequence.duration && ` (${sequence.duration}ms)`}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          disabled={isPlaying}
                          onClick={(e) => {
                            e.stopPropagation();
                            playSequence(sequence);
                          }}
                        >
                          <Play size={14} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteSequence(sequence.id);
                          }}
                        >
                          <Trash size={14} />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              <div className="flex gap-2 mt-3">
                <Input 
                  placeholder="New sequence name" 
                  value={newSequenceName}
                  onChange={(e) => setNewSequenceName(e.target.value)}
                />
                <Button onClick={addSequence} disabled={!newSequenceName}>
                  <Plus size={16} className="mr-1" />
                  Add
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="editor">
            {activeSequence ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sequence-name">Sequence Name</Label>
                  <Input 
                    id="sequence-name"
                    value={activeSequence.name}
                    onChange={(e) => updateCurrentSequence({ name: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>States</Label>
                    <div className="flex gap-1">
                      {(['default', 'hover', 'active', 'focus', 'disabled'] as ComponentState[]).map(state => (
                        <Button 
                          key={state} 
                          variant="outline" 
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => addStateToSequence(state)}
                        >
                          +{state.charAt(0).toUpperCase()}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-2 min-h-[100px]">
                    {activeSequence.states.length === 0 ? (
                      <div className="text-center py-4 text-sm text-muted-foreground">
                        No states in sequence
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {activeSequence.states.map((state, index) => (
                          <div 
                            key={`${state}-${index}`} 
                            className="flex items-center gap-1 border rounded px-2 py-1"
                          >
                            <span className="text-sm capitalize">{state}</span>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-4 w-4"
                              onClick={() => removeStateFromSequence(index)}
                            >
                              <Trash size={12} />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (ms)</Label>
                    <Input 
                      id="duration" 
                      type="number" 
                      min="0" 
                      max="5000"
                      value={activeSequence.duration || 300}
                      onChange={(e) => updateCurrentSequence({ 
                        duration: parseInt(e.target.value) || 0 
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="delay">Delay (ms)</Label>
                    <Input 
                      id="delay" 
                      type="number" 
                      min="0" 
                      max="2000"
                      value={activeSequence.delay || 0}
                      onChange={(e) => updateCurrentSequence({ 
                        delay: parseInt(e.target.value) || 0 
                      })}
                    />
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button 
                    variant="outline"
                    onClick={() => setCurrentSequence(sequences[0].id)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={() => playSequence(activeSequence)} disabled={isPlaying}>
                    <Play size={16} className="mr-2" />
                    Play Sequence
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Select a sequence to edit
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default BatchStateManager;
