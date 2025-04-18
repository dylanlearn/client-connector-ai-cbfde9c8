
import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { useEnhancedHistory } from '@/hooks/wireframe/use-enhanced-history';
import { useKeyboardShortcuts } from '@/hooks/wireframe/use-keyboard-shortcuts';
import { useAlignmentDistribution } from '@/hooks/wireframe/use-alignment-distribution';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { alignmentPresets } from '@/components/wireframe/utils/alignment-distribution';
import AlignmentControls from '@/components/wireframe/controls/AlignmentControls';
import HistoryPanel from '@/components/wireframe/history/HistoryPanel';
import {
  Layers,
  Square,
  Circle,
  Type,
  Image as ImageIcon,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const InteractionPreview: React.FC = () => {
  // Canvas and state management
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showAlignmentPanel, setShowAlignmentPanel] = useState(true);
  const [newCheckpointName, setNewCheckpointName] = useState('');
  const [newBranchName, setNewBranchName] = useState('');
  
  // Initial canvas data
  const initialData = {
    objects: [],
    background: '#f5f5f5'
  };
  
  // Set up enhanced history
  const history = useEnhancedHistory(initialData, {
    maxHistoryStates: 30,
    enableCompression: true,
    autoNameStates: true,
    enableBranching: true
  });
  
  // Set up alignment and distribution
  const alignmentDistribution = useAlignmentDistribution(canvas);
  
  // Set up keyboard shortcuts
  const { registerShortcut } = useKeyboardShortcuts({
    enabled: true,
    showToasts: true
  });
  
  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current || canvas) return;
    
    const newCanvas = new fabric.Canvas(canvasRef.current, {
      width: 600,
      height: 400,
      backgroundColor: '#f5f5f5',
    });
    
    setCanvas(newCanvas);
    
    return () => {
      newCanvas.dispose();
    };
  }, [canvas]);
  
  // Set up keyboard shortcuts
  useEffect(() => {
    if (!canvas) return;
    
    // Undo/Redo shortcuts
    registerShortcut({
      name: 'undo',
      keys: ['control', 'z'],
      description: 'Undo the last action',
      action: () => history.undo(),
      category: 'History'
    });
    
    registerShortcut({
      name: 'redo',
      keys: ['control', 'y'],
      description: 'Redo the last undone action',
      action: () => history.redo(),
      category: 'History'
    });
    
    // Alignment shortcuts
    registerShortcut({
      name: 'alignLeft',
      keys: ['alt', 'shift', 'l'],
      description: 'Align selected objects to the left',
      action: () => alignmentDistribution.alignLeft(),
      category: 'Alignment'
    });
    
    registerShortcut({
      name: 'alignCenter',
      keys: ['alt', 'shift', 'c'],
      description: 'Align selected objects to the horizontal center',
      action: () => alignmentDistribution.alignCenterH(),
      category: 'Alignment'
    });
    
    registerShortcut({
      name: 'alignRight',
      keys: ['alt', 'shift', 'r'],
      description: 'Align selected objects to the right',
      action: () => alignmentDistribution.alignRight(),
      category: 'Alignment'
    });
    
    registerShortcut({
      name: 'alignTop',
      keys: ['alt', 'shift', 't'],
      description: 'Align selected objects to the top',
      action: () => alignmentDistribution.alignTop(),
      category: 'Alignment'
    });
    
    registerShortcut({
      name: 'alignMiddle',
      keys: ['alt', 'shift', 'm'],
      description: 'Align selected objects to the vertical middle',
      action: () => alignmentDistribution.alignMiddle(),
      category: 'Alignment'
    });
    
    registerShortcut({
      name: 'alignBottom',
      keys: ['alt', 'shift', 'b'],
      description: 'Align selected objects to the bottom',
      action: () => alignmentDistribution.alignBottom(),
      category: 'Alignment'
    });
    
    // Distribution shortcuts
    registerShortcut({
      name: 'distributeHorizontally',
      keys: ['alt', 'shift', 'h'],
      description: 'Distribute selected objects horizontally',
      action: () => alignmentDistribution.distributeHorizontally(),
      category: 'Distribution'
    });
    
    registerShortcut({
      name: 'distributeVertically',
      keys: ['alt', 'shift', 'v'],
      description: 'Distribute selected objects vertically',
      action: () => alignmentDistribution.distributeVertically(),
      category: 'Distribution'
    });
    
    // Setup dynamic guides
    const cleanupGuides = alignmentDistribution.setupDynamicGuides();
    
    return () => {
      cleanupGuides();
    };
  }, [canvas, registerShortcut, history, alignmentDistribution]);
  
  // Update history when canvas changes
  useEffect(() => {
    if (!canvas) return;
    
    const handleObjectModified = () => {
      saveToHistory();
    };
    
    const handlePathCreated = () => {
      saveToHistory();
    };
    
    canvas.on('object:modified', handleObjectModified);
    canvas.on('path:created', handlePathCreated);
    
    return () => {
      canvas.off('object:modified', handleObjectModified);
      canvas.off('path:created', handlePathCreated);
    };
  }, [canvas]);
  
  // Save the current canvas state to history
  const saveToHistory = () => {
    if (!canvas) return;
    
    const json = canvas.toJSON(['id', 'name']);
    history.pushState(json);
  };
  
  // Load a state from history
  const loadFromHistory = (data: any) => {
    if (!canvas || !data) return;
    
    canvas.clear();
    canvas.loadFromJSON(data, () => {
      canvas.renderAll();
    });
  };
  
  // Watch for history changes and update canvas
  useEffect(() => {
    loadFromHistory(history.data);
  }, [history.data]);
  
  // Add a shape to the canvas
  const addShape = (type: 'rect' | 'circle' | 'text') => {
    if (!canvas) return;
    
    let object;
    
    switch (type) {
      case 'rect':
        object = new fabric.Rect({
          left: 100,
          top: 100,
          width: 100,
          height: 80,
          fill: getRandomColor(),
          stroke: '#000',
          strokeWidth: 1,
        });
        break;
      case 'circle':
        object = new fabric.Circle({
          left: 100,
          top: 100,
          radius: 50,
          fill: getRandomColor(),
          stroke: '#000',
          strokeWidth: 1,
        });
        break;
      case 'text':
        object = new fabric.Textbox('Text', {
          left: 100,
          top: 100,
          width: 150,
          fontSize: 20,
          fill: '#000000',
        });
        break;
    }
    
    if (object) {
      canvas.add(object);
      canvas.setActiveObject(object);
      canvas.renderAll();
      saveToHistory();
    }
  };
  
  // Helper function to get random colors
  const getRandomColor = () => {
    const colors = [
      '#FF5252', '#FF4081', '#E040FB', '#7C4DFF',
      '#536DFE', '#448AFF', '#40C4FF', '#18FFFF',
      '#64FFDA', '#69F0AE', '#B2FF59', '#EEFF41',
      '#FFFF00', '#FFD740', '#FFAB40', '#FF6E40'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  
  // Create a checkpoint
  const handleCreateCheckpoint = () => {
    if (newCheckpointName.trim() !== '') {
      history.createCheckpoint(newCheckpointName);
      setNewCheckpointName('');
    }
  };
  
  // Create a branch
  const handleCreateBranch = () => {
    if (newBranchName.trim() !== '') {
      history.createBranch(newBranchName);
      setNewBranchName('');
    }
  };
  
  return (
    <div className="interaction-preview p-4">
      <h2 className="text-2xl font-bold mb-4">Interactive Design Canvas</h2>
      <p className="text-muted-foreground mb-6">
        Demonstration of enhanced history management and object alignment features
      </p>
      
      <div className="flex h-[600px]">
        {/* Main Editor Area */}
        <div className={`flex-grow flex flex-col ${showSidebar ? 'mr-4' : ''}`}>
          {/* Toolbar */}
          <div className="bg-muted p-2 rounded-t-md flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => addShape('rect')}
                title="Add Rectangle"
              >
                <Square className="h-4 w-4 mr-1" />
                Rectangle
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => addShape('circle')}
                title="Add Circle"
              >
                <Circle className="h-4 w-4 mr-1" />
                Circle
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => addShape('text')}
                title="Add Text"
              >
                <Type className="h-4 w-4 mr-1" />
                Text
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => history.undo()}
                disabled={!history.canUndo}
              >
                Undo
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => history.redo()}
                disabled={!history.canRedo}
              >
                Redo
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSidebar(!showSidebar)}
              >
                {showSidebar ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          {/* Canvas */}
          <div className="relative flex-grow border rounded-b-md overflow-hidden bg-white">
            <canvas ref={canvasRef} className="absolute top-0 left-0" />
            
            {/* Alignment controls overlay */}
            {showAlignmentPanel && alignmentDistribution.hasMultipleObjectsSelected() && (
              <div className="absolute top-4 right-4 z-10">
                <AlignmentControls
                  onAlignLeft={alignmentDistribution.alignLeft}
                  onAlignCenterH={alignmentDistribution.alignCenterH}
                  onAlignRight={alignmentDistribution.alignRight}
                  onAlignTop={alignmentDistribution.alignTop}
                  onAlignMiddle={alignmentDistribution.alignMiddle}
                  onAlignBottom={alignmentDistribution.alignBottom}
                  onDistributeHorizontally={alignmentDistribution.distributeHorizontally}
                  onDistributeVertically={alignmentDistribution.distributeVertically}
                  onSpaceEvenlyHorizontal={alignmentDistribution.spaceEvenlyHorizontal}
                  onSpaceEvenlyVertical={alignmentDistribution.spaceEvenlyVertical}
                  enabled={true}
                />
              </div>
            )}
          </div>
        </div>
        
        {/* Sidebar */}
        {showSidebar && (
          <div className="w-64 border rounded-md overflow-hidden flex flex-col">
            <Tabs defaultValue="history">
              <TabsList className="w-full">
                <TabsTrigger value="history" className="flex-1">History</TabsTrigger>
                <TabsTrigger value="alignment" className="flex-1">Alignment</TabsTrigger>
              </TabsList>
              <TabsContent value="history" className="p-0 flex-1 flex flex-col">
                <div className="p-2 space-y-2">
                  <div className="flex space-x-2">
                    <Input 
                      placeholder="Checkpoint name..." 
                      value={newCheckpointName}
                      onChange={(e) => setNewCheckpointName(e.target.value)}
                      className="h-8"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCreateCheckpoint}
                    >
                      Save
                    </Button>
                  </div>
                  <div className="flex space-x-2">
                    <Input 
                      placeholder="Branch name..." 
                      value={newBranchName}
                      onChange={(e) => setNewBranchName(e.target.value)}
                      className="h-8"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCreateBranch}
                    >
                      Branch
                    </Button>
                  </div>
                </div>
                
                <div className="flex-1 overflow-hidden">
                  <HistoryPanel
                    branches={history.branches}
                    activeBranchId={history.activeBranchId}
                    currentStateIndex={history.currentStateIndex}
                    onGoToState={history.goToState}
                    onSwitchBranch={history.switchBranch}
                    onMergeBranch={history.mergeBranch}
                    onCreateBranch={history.createBranch}
                    onCreateCheckpoint={history.createCheckpoint}
                    onUndo={history.undo}
                    onRedo={history.redo}
                    canUndo={history.canUndo}
                    canRedo={history.canRedo}
                  />
                </div>
              </TabsContent>
              <TabsContent value="alignment" className="p-2">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Alignment Presets</h3>
                    <div className="grid grid-cols-3 gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => alignmentPresets.topLeft(canvas!)}
                        disabled={!alignmentDistribution.hasMultipleObjectsSelected()}
                      >
                        Top Left
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => alignmentPresets.topCenter(canvas!)}
                        disabled={!alignmentDistribution.hasMultipleObjectsSelected()}
                      >
                        Top Center
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => alignmentPresets.topRight(canvas!)}
                        disabled={!alignmentDistribution.hasMultipleObjectsSelected()}
                      >
                        Top Right
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => alignmentPresets.middleLeft(canvas!)}
                        disabled={!alignmentDistribution.hasMultipleObjectsSelected()}
                      >
                        Middle Left
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => alignmentPresets.center(canvas!)}
                        disabled={!alignmentDistribution.hasMultipleObjectsSelected()}
                      >
                        Center
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => alignmentPresets.middleRight(canvas!)}
                        disabled={!alignmentDistribution.hasMultipleObjectsSelected()}
                      >
                        Middle Right
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => alignmentPresets.bottomLeft(canvas!)}
                        disabled={!alignmentDistribution.hasMultipleObjectsSelected()}
                      >
                        Bottom Left
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => alignmentPresets.bottomCenter(canvas!)}
                        disabled={!alignmentDistribution.hasMultipleObjectsSelected()}
                      >
                        Bottom Center
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => alignmentPresets.bottomRight(canvas!)}
                        disabled={!alignmentDistribution.hasMultipleObjectsSelected()}
                      >
                        Bottom Right
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Smart Distribution</h3>
                    <div className="grid grid-cols-2 gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={alignmentDistribution.distributeHorizontally}
                        disabled={!alignmentDistribution.hasMultipleObjectsSelected()}
                      >
                        Distribute H
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={alignmentDistribution.distributeVertically}
                        disabled={!alignmentDistribution.hasMultipleObjectsSelected()}
                      >
                        Distribute V
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={alignmentDistribution.spaceEvenlyHorizontal}
                        disabled={!alignmentDistribution.hasMultipleObjectsSelected()}
                      >
                        Space Evenly H
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={alignmentDistribution.spaceEvenlyVertical}
                        disabled={!alignmentDistribution.hasMultipleObjectsSelected()}
                      >
                        Space Evenly V
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Guide Settings</h3>
                    <div className="flex items-center">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => setShowAlignmentPanel(!showAlignmentPanel)}
                      >
                        {showAlignmentPanel ? 'Hide Alignment Panel' : 'Show Alignment Panel'}
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractionPreview;
