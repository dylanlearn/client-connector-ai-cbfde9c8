
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { throttle } from 'lodash';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import {
  GuideDefinition,
  SnapGuideType,
  SmartGuideConfiguration,
  DistanceIndicator
} from '../types/canvas-types';
import DistanceIndicatorComponent from './DistanceIndicatorComponent';

// Default guide configuration
export const DEFAULT_SMART_GUIDE_CONFIG: SmartGuideConfiguration = {
  enabled: true,
  snapDistance: 8,
  snapTypes: ['edge', 'center', 'distribution', 'grid'],
  guideColor: 'rgba(0, 120, 255, 0.5)',
  activeGuideColor: 'rgba(0, 120, 255, 0.8)',
  guideThickness: 1,
  showDistanceLabels: true,
  persistGuides: true,
  showEdgeGuides: true,
  showCenterGuides: true,
  showDistributionGuides: true,
  maxGuidesRendered: 20,
  throttleInterval: 16, // ~60fps
  useGuideMemoization: true,
  animateSnap: true,
  flashDuration: 200,
  dashPattern: [5, 2],
  edgeDetectionThreshold: 5,
  detectAngledEdges: false,
  intelligentGuidePriority: true
};

interface SmartGuideSystemProps {
  /**
   * The fabric.js canvas instance
   */
  canvas: fabric.Canvas;
  /**
   * Whether the guide system is enabled
   */
  enabled?: boolean;
  /**
   * Color of guides
   */
  guideColor?: string;
  /**
   * Snapping threshold in pixels
   */
  snapThreshold?: number;
  /**
   * Whether to show edge guides
   */
  showEdgeGuides?: boolean;
  /**
   * Whether to show center guides
   */
  showCenterGuides?: boolean;
  /**
   * Whether to show distribution guides
   */
  showDistributionGuides?: boolean;
  /**
   * Whether to show distance indicators
   */
  showDistanceIndicators?: boolean;
  /**
   * Guide snapping strength (higher means stronger snapping)
   */
  magneticStrength?: number;
  /**
   * Additional CSS class names
   */
  className?: string;
}

/**
 * Smart Guide System with intelligent edge detection and performance optimization
 */
const SmartGuideSystem: React.FC<SmartGuideSystemProps> = ({
  canvas,
  enabled = true,
  guideColor = 'rgba(0, 120, 255, 0.75)',
  snapThreshold = 8,
  showEdgeGuides = true,
  showCenterGuides = true,
  showDistributionGuides = true,
  showDistanceIndicators = true,
  magneticStrength = 5,
  className
}) => {
  const { toast } = useToast();
  const guidesRef = useRef<SVGSVGElement>(null);
  const boundingBoxCache = useRef<Map<string, fabric.Object>>(new Map());
  
  // State
  const [guides, setGuides] = useState<GuideDefinition[]>([]);
  const [activeGuides, setActiveGuides] = useState<GuideDefinition[]>([]);
  const [persistentGuides, setPersistentGuides] = useState<GuideDefinition[]>([]);
  const [movingObject, setMovingObject] = useState<fabric.Object | null>(null);
  const [distanceIndicators, setDistanceIndicators] = useState<DistanceIndicator[]>([]);
  const [canvasObjects, setCanvasObjects] = useState<fabric.Object[]>([]);
  const [config, setConfig] = useState<SmartGuideConfiguration>({
    ...DEFAULT_SMART_GUIDE_CONFIG,
    enabled,
    guideColor,
    activeGuideColor: guideColor.replace('0.5', '0.8'),
    snapDistance: snapThreshold,
    showEdgeGuides,
    showCenterGuides,
    showDistributionGuides,
    showDistanceLabels: showDistanceIndicators
  });
  
  /**
   * Calculate object bounds with rotation and scaling
   */
  const calculateObjectBounds = useCallback((obj: fabric.Object) => {
    // Use object bounding box (accounts for rotation, scaling, etc.)
    const bounds = obj.getBoundingRect(true, true);
    
    return {
      left: bounds.left,
      top: bounds.top,
      right: bounds.left + bounds.width,
      bottom: bounds.top + bounds.height,
      width: bounds.width,
      height: bounds.height,
      centerX: bounds.left + bounds.width / 2,
      centerY: bounds.top + bounds.height / 2,
      id: obj.data?.id || obj.id || `obj-${obj.type}-${Date.now()}`
    };
  }, []);

  /**
   * Generate edge guides for all objects
   */
  const generateEdgeGuides = useCallback((objects: fabric.Object[], activeObj?: fabric.Object | null) => {
    if (!config.showEdgeGuides) return [];
    
    const guides: GuideDefinition[] = [];
    const activeObjId = activeObj?.data?.id || activeObj?.id;
    
    objects.forEach(obj => {
      const objId = obj.data?.id || obj.id;
      // Skip the active object
      if (objId === activeObjId) return;
      
      const bounds = calculateObjectBounds(obj);
      
      // Create edge guides
      guides.push({
        id: `v-left-${objId}`,
        orientation: 'vertical',
        position: bounds.left,
        type: 'edge',
        label: 'Left',
        persistent: false,
        strength: 10,
        color: config.guideColor
      });
      
      guides.push({
        id: `v-right-${objId}`,
        orientation: 'vertical',
        position: bounds.right,
        type: 'edge',
        label: 'Right',
        persistent: false,
        strength: 10,
        color: config.guideColor
      });
      
      guides.push({
        id: `h-top-${objId}`,
        orientation: 'horizontal',
        position: bounds.top,
        type: 'edge',
        label: 'Top',
        persistent: false,
        strength: 10,
        color: config.guideColor
      });
      
      guides.push({
        id: `h-bottom-${objId}`,
        orientation: 'horizontal',
        position: bounds.bottom,
        type: 'edge',
        label: 'Bottom',
        persistent: false,
        strength: 10,
        color: config.guideColor
      });
    });
    
    return guides;
  }, [config.showEdgeGuides, config.guideColor, calculateObjectBounds]);

  /**
   * Generate center guides for all objects
   */
  const generateCenterGuides = useCallback((objects: fabric.Object[], activeObj?: fabric.Object | null) => {
    if (!config.showCenterGuides) return [];
    
    const guides: GuideDefinition[] = [];
    const activeObjId = activeObj?.data?.id || activeObj?.id;
    
    objects.forEach(obj => {
      const objId = obj.data?.id || obj.id;
      // Skip the active object
      if (objId === activeObjId) return;
      
      const bounds = calculateObjectBounds(obj);
      
      // Create center guides
      guides.push({
        id: `v-center-${objId}`,
        orientation: 'vertical',
        position: bounds.centerX,
        type: 'center',
        label: 'Center X',
        persistent: false,
        strength: 8,
        color: config.guideColor
      });
      
      guides.push({
        id: `h-center-${objId}`,
        orientation: 'horizontal',
        position: bounds.centerY,
        type: 'center',
        label: 'Center Y',
        persistent: false,
        strength: 8,
        color: config.guideColor
      });
    });
    
    return guides;
  }, [config.showCenterGuides, config.guideColor, calculateObjectBounds]);

  /**
   * Generate distribution guides for evenly spaced objects
   */
  const generateDistributionGuides = useCallback((objects: fabric.Object[], activeObj?: fabric.Object | null) => {
    if (!config.showDistributionGuides || objects.length < 3) return [];
    
    const guides: GuideDefinition[] = [];
    const activeObjId = activeObj?.data?.id || activeObj?.id;
    
    // Calculate horizontal distribution
    const sortedByX = [...objects].sort((a, b) => {
      const boundsA = calculateObjectBounds(a);
      const boundsB = calculateObjectBounds(b);
      return boundsA.centerX - boundsB.centerX;
    });
    
    // Check for potential distribution patterns
    if (sortedByX.length >= 3) {
      for (let i = 1; i < sortedByX.length - 1; i++) {
        const prevObj = sortedByX[i - 1];
        const currObj = sortedByX[i];
        const nextObj = sortedByX[i + 1];
        
        const prevBounds = calculateObjectBounds(prevObj);
        const currBounds = calculateObjectBounds(currObj);
        const nextBounds = calculateObjectBounds(nextObj);
        
        // See if objects might be evenly spaced horizontally
        const dist1 = currBounds.centerX - prevBounds.centerX;
        const dist2 = nextBounds.centerX - currBounds.centerX;
        
        if (Math.abs(dist1 - dist2) < config.snapDistance) {
          guides.push({
            id: `distribution-x-${i}`,
            orientation: 'vertical',
            position: currBounds.centerX,
            type: 'distribution',
            label: `${Math.round(dist1)}px`,
            persistent: false,
            strength: 6,
            color: config.guideColor
          });
        }
      }
    }
    
    // Calculate vertical distribution
    const sortedByY = [...objects].sort((a, b) => {
      const boundsA = calculateObjectBounds(a);
      const boundsB = calculateObjectBounds(b);
      return boundsA.centerY - boundsB.centerY;
    });
    
    // Check for potential distribution patterns
    if (sortedByY.length >= 3) {
      for (let i = 1; i < sortedByY.length - 1; i++) {
        const prevObj = sortedByY[i - 1];
        const currObj = sortedByY[i];
        const nextObj = sortedByY[i + 1];
        
        const prevBounds = calculateObjectBounds(prevObj);
        const currBounds = calculateObjectBounds(currObj);
        const nextBounds = calculateObjectBounds(nextObj);
        
        // See if objects might be evenly spaced vertically
        const dist1 = currBounds.centerY - prevBounds.centerY;
        const dist2 = nextBounds.centerY - currBounds.centerY;
        
        if (Math.abs(dist1 - dist2) < config.snapDistance) {
          guides.push({
            id: `distribution-y-${i}`,
            orientation: 'horizontal',
            position: currBounds.centerY,
            type: 'distribution',
            label: `${Math.round(dist1)}px`,
            persistent: false,
            strength: 6,
            color: config.guideColor
          });
        }
      }
    }
    
    return guides;
  }, [config.showDistributionGuides, config.snapDistance, config.guideColor, calculateObjectBounds]);

  /**
   * Generate distance indicators between objects
   */
  const generateDistanceIndicators = useCallback((objects: fabric.Object[], activeObj?: fabric.Object | null) => {
    if (!config.showDistanceLabels || !activeObj) return [];
    
    const indicators: DistanceIndicator[] = [];
    const activeObjBounds = calculateObjectBounds(activeObj);
    const activeObjId = activeObj.data?.id || activeObj.id;
    
    objects.forEach(obj => {
      const objId = obj.data?.id || obj.id;
      // Skip the active object
      if (objId === activeObjId) return;
      
      const bounds = calculateObjectBounds(obj);
      
      // Horizontal distance
      if (bounds.left > activeObjBounds.right) {
        // Active object is to the left of this object
        indicators.push({
          id: `dist-h-${activeObjId}-${objId}`,
          startPoint: { x: activeObjBounds.right, y: activeObjBounds.centerY },
          endPoint: { x: bounds.left, y: bounds.centerY },
          distance: bounds.left - activeObjBounds.right,
          orientation: 'horizontal',
          color: config.guideColor
        });
      } else if (activeObjBounds.left > bounds.right) {
        // Active object is to the right of this object
        indicators.push({
          id: `dist-h-${objId}-${activeObjId}`,
          startPoint: { x: bounds.right, y: bounds.centerY },
          endPoint: { x: activeObjBounds.left, y: activeObjBounds.centerY },
          distance: activeObjBounds.left - bounds.right,
          orientation: 'horizontal',
          color: config.guideColor
        });
      }
      
      // Vertical distance
      if (bounds.top > activeObjBounds.bottom) {
        // Active object is above this object
        indicators.push({
          id: `dist-v-${activeObjId}-${objId}`,
          startPoint: { x: activeObjBounds.centerX, y: activeObjBounds.bottom },
          endPoint: { x: bounds.centerX, y: bounds.top },
          distance: bounds.top - activeObjBounds.bottom,
          orientation: 'vertical',
          color: config.guideColor
        });
      } else if (activeObjBounds.top > bounds.bottom) {
        // Active object is below this object
        indicators.push({
          id: `dist-v-${objId}-${activeObjId}`,
          startPoint: { x: bounds.centerX, y: bounds.bottom },
          endPoint: { x: activeObjBounds.centerX, y: activeObjBounds.top },
          distance: activeObjBounds.top - bounds.bottom,
          orientation: 'vertical',
          color: config.guideColor
        });
      }
    });
    
    // Limit the number of indicators shown to avoid overwhelming the UI
    return indicators.slice(0, 4);
  }, [config.showDistanceLabels, config.guideColor, calculateObjectBounds]);

  /**
   * Find the nearest guides for an object
   * Returns active guides and their offset values
   */
  const findNearestGuides = useCallback((
    obj: fabric.Object,
    allGuides: GuideDefinition[],
    activeSnapDistance: number
  ) => {
    const bounds = calculateObjectBounds(obj);
    const activeMatchingGuides: GuideDefinition[] = [];
    const snapOffsets: { offsetX: number; offsetY: number } = { offsetX: 0, offsetY: 0 };
    
    // Points to check for snapping
    const checkPoints = {
      vertical: [
        { key: 'left', value: bounds.left },
        { key: 'centerX', value: bounds.centerX },
        { key: 'right', value: bounds.right }
      ],
      horizontal: [
        { key: 'top', value: bounds.top },
        { key: 'centerY', value: bounds.centerY },
        { key: 'bottom', value: bounds.bottom }
      ]
    };
    
    // Temporary storage for best matches
    let bestVerticalMatch: { guide: GuideDefinition; distance: number; offset: number } | null = null;
    let bestHorizontalMatch: { guide: GuideDefinition; distance: number; offset: number } | null = null;
    
    // Check all guides for snap points
    allGuides.forEach(guide => {
      if (guide.orientation === 'vertical') {
        checkPoints.vertical.forEach(point => {
          const distance = Math.abs(guide.position - point.value);
          
          // Check if this guide is closer than our current best match
          if (distance <= activeSnapDistance) {
            if (!bestVerticalMatch || distance < bestVerticalMatch.distance) {
              bestVerticalMatch = {
                guide,
                distance,
                offset: guide.position - point.value
              };
            }
          }
        });
      } else if (guide.orientation === 'horizontal') {
        checkPoints.horizontal.forEach(point => {
          const distance = Math.abs(guide.position - point.value);
          
          // Check if this guide is closer than our current best match
          if (distance <= activeSnapDistance) {
            if (!bestHorizontalMatch || distance < bestHorizontalMatch.distance) {
              bestHorizontalMatch = {
                guide,
                distance,
                offset: guide.position - point.value
              };
            }
          }
        });
      }
    });
    
    // Apply the best matches to the active guides
    if (bestVerticalMatch) {
      activeMatchingGuides.push({
        ...bestVerticalMatch.guide,
        color: config.activeGuideColor
      });
      snapOffsets.offsetX = bestVerticalMatch.offset;
    }
    
    if (bestHorizontalMatch) {
      activeMatchingGuides.push({
        ...bestHorizontalMatch.guide,
        color: config.activeGuideColor
      });
      snapOffsets.offsetY = bestHorizontalMatch.offset;
    }
    
    return { activeMatchingGuides, snapOffsets };
  }, [calculateObjectBounds, config.activeGuideColor]);

  /**
   * Apply guide snapping to the moving object
   */
  const snapObjectToGuides = useCallback((
    obj: fabric.Object, 
    snapOffsets: { offsetX: number; offsetY: number },
    strength: number = magneticStrength
  ) => {
    // Snap with easing/strength factor
    if (snapOffsets.offsetX !== 0) {
      obj.left = obj.left! + (snapOffsets.offsetX * (strength / 10));
    }
    
    if (snapOffsets.offsetY !== 0) {
      obj.top = obj.top! + (snapOffsets.offsetY * (strength / 10));
    }
    
    // Ensure the object stays within the canvas
    if (canvas) {
      const objBounds = obj.getBoundingRect();
      const canvasWidth = canvas.width || 0;
      const canvasHeight = canvas.height || 0;
      
      // Prevent objects from going off-canvas
      if (objBounds.left < 0) obj.left = obj.left! - objBounds.left;
      if (objBounds.top < 0) obj.top = obj.top! - objBounds.top;
      if (objBounds.left + objBounds.width > canvasWidth) {
        obj.left = obj.left! - ((objBounds.left + objBounds.width) - canvasWidth);
      }
      if (objBounds.top + objBounds.height > canvasHeight) {
        obj.top = obj.top! - ((objBounds.top + objBounds.height) - canvasHeight);
      }
    }
    
    obj.setCoords();
  }, [canvas, magneticStrength]);

  /**
   * Update all guides based on canvas objects
   * Throttled for performance on large canvases
   */
  const updateGuides = useMemo(() => 
    throttle((activeObj?: fabric.Object | null) => {
      if (!config.enabled) {
        setGuides([]);
        setActiveGuides([]);
        setDistanceIndicators([]);
        return;
      }
      
      // Get all objects from the canvas
      const allObjects = canvas.getObjects().filter(obj => {
        // Filter out non-visible objects, guides, etc.
        return obj.visible !== false && 
               obj.type !== 'line' && 
               obj.name !== 'guide' &&
               obj.name !== 'grid';
      });
      
      // Update canvas objects reference
      setCanvasObjects(allObjects);
      
      // Generate guides
      const edgeGuides = generateEdgeGuides(allObjects, activeObj);
      const centerGuides = generateCenterGuides(allObjects, activeObj);
      const distributionGuides = generateDistributionGuides(allObjects, activeObj);
      
      // Combine all guides, respecting max guides limit
      const combinedGuides = [
        ...edgeGuides, 
        ...centerGuides, 
        ...distributionGuides
      ].slice(0, config.maxGuidesRendered);
      
      // Update distance indicators if we have an active object
      const newDistanceIndicators = activeObj ? 
        generateDistanceIndicators(allObjects, activeObj) : 
        [];
      
      // Find active guides for the current object if moving
      let newActiveGuides: GuideDefinition[] = [];
      if (activeObj) {
        const { activeMatchingGuides } = findNearestGuides(
          activeObj, 
          [...combinedGuides, ...persistentGuides], 
          config.snapDistance
        );
        newActiveGuides = activeMatchingGuides;
      }
      
      setGuides(combinedGuides);
      setActiveGuides(newActiveGuides);
      setDistanceIndicators(newDistanceIndicators);
    }, config.throttleInterval), 
    [
      canvas, config.enabled, config.maxGuidesRendered, config.snapDistance, config.throttleInterval,
      generateEdgeGuides, generateCenterGuides, generateDistributionGuides, generateDistanceIndicators,
      findNearestGuides, persistentGuides
    ]
  );

  // Initialize and clean up event handlers
  useEffect(() => {
    if (!canvas || !config.enabled) return;
    
    // Generate initial guides
    updateGuides();
    
    // Handle object movement for snapping
    const handleObjectMoving = (e: fabric.IEvent) => {
      if (!config.enabled || !e.target) return;
      
      const obj = e.target;
      setMovingObject(obj);
      
      // Update guides during movement to show potential snapping
      updateGuides(obj);
      
      // Find nearest guides and apply snapping
      const { activeMatchingGuides, snapOffsets } = findNearestGuides(
        obj, 
        [...guides, ...persistentGuides], 
        config.snapDistance
      );
      
      if (activeMatchingGuides.length > 0) {
        // Apply snapping
        snapObjectToGuides(obj, snapOffsets, magneticStrength);
        
        // Highlight active guides
        setActiveGuides(activeMatchingGuides);
      } else {
        setActiveGuides([]);
      }
    };
    
    // Handle object movement end
    const handleObjectMovingDone = (e: fabric.IEvent) => {
      if (!config.enabled) return;
      
      // Clear moving object reference
      setMovingObject(null);
      
      // Update guides one final time to reflect the new position
      updateGuides();
      
      // Clear active guides
      setActiveGuides([]);
    };
    
    // Handle selection changes
    const handleSelectionCreated = (e: fabric.IEvent) => {
      if (!config.enabled) return;
      
      // Update guides for the selected object
      if (e.selected && e.selected.length > 0) {
        updateGuides(e.selected[0]);
      }
    };
    
    const handleSelectionCleared = () => {
      if (!config.enabled) return;
      
      // Update guides without a selected object
      updateGuides();
      setActiveGuides([]);
      setDistanceIndicators([]);
    };
    
    // Register event listeners
    canvas.on('object:moving', handleObjectMoving);
    canvas.on('object:modified', handleObjectMovingDone);
    canvas.on('selection:created', handleSelectionCreated);
    canvas.on('selection:updated', handleSelectionCreated);
    canvas.on('selection:cleared', handleSelectionCleared);
    
    // Clean up event listeners on unmount
    return () => {
      canvas.off('object:moving', handleObjectMoving);
      canvas.off('object:modified', handleObjectMovingDone);
      canvas.off('selection:created', handleSelectionCreated);
      canvas.off('selection:updated', handleSelectionCreated);
      canvas.off('selection:cleared', handleSelectionCleared);
    };
  }, [
    canvas, config.enabled, config.snapDistance, guides, persistentGuides,
    updateGuides, findNearestGuides, snapObjectToGuides, magneticStrength
  ]);

  // Function to add a persistent guide
  const addPersistentGuide = useCallback((guide: GuideDefinition) => {
    setPersistentGuides(prevGuides => [...prevGuides, { ...guide, persistent: true }]);
    
    toast({
      title: "Guide Added",
      description: `Added permanent ${guide.orientation} guide at position ${guide.position}`
    });
  }, [toast]);
  
  // Function to remove a persistent guide
  const removePersistentGuide = useCallback((guideId: string) => {
    setPersistentGuides(prevGuides => prevGuides.filter(g => g.id !== guideId));
    
    toast({
      title: "Guide Removed",
      description: "Persistent guide removed"
    });
  }, [toast]);
  
  // Function to clear all persistent guides
  const clearPersistentGuides = useCallback(() => {
    setPersistentGuides([]);
    
    toast({
      title: "Guides Cleared",
      description: "All persistent guides removed"
    });
  }, [toast]);

  // Load persistent guides from localStorage on component mount
  useEffect(() => {
    try {
      const savedGuides = localStorage.getItem('smart-guide-system-guides');
      
      if (savedGuides) {
        setPersistentGuides(JSON.parse(savedGuides));
      }
    } catch (error) {
      console.error('Failed to load persistent guides:', error);
    }
  }, []);
  
  // Save persistent guides to localStorage on changes
  useEffect(() => {
    if (config.persistGuides) {
      try {
        localStorage.setItem('smart-guide-system-guides', JSON.stringify(persistentGuides));
      } catch (error) {
        console.error('Failed to save persistent guides:', error);
      }
    }
  }, [persistentGuides, config.persistGuides]);

  // If disabled, don't render anything
  if (!config.enabled) {
    return null;
  }

  // Render all guides and indicators
  return (
    <>
      <svg
        ref={guidesRef}
        className={cn(
          "absolute top-0 left-0 w-full h-full pointer-events-none z-10",
          className
        )}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Render persistent guides */}
        {persistentGuides.map(guide => (
          <line
            key={guide.id}
            x1={guide.orientation === 'vertical' ? guide.position : 0}
            y1={guide.orientation === 'horizontal' ? guide.position : 0}
            x2={guide.orientation === 'vertical' ? guide.position : canvas.width || 0}
            y2={guide.orientation === 'horizontal' ? guide.position : canvas.height || 0}
            stroke={guide.color || config.guideColor}
            strokeWidth={config.guideThickness}
            strokeDasharray={config.dashPattern?.join(' ')}
            opacity={1}
          />
        ))}
        
        {/* Render regular guides */}
        {guides.map(guide => (
          <line
            key={guide.id}
            x1={guide.orientation === 'vertical' ? guide.position : 0}
            y1={guide.orientation === 'horizontal' ? guide.position : 0}
            x2={guide.orientation === 'vertical' ? guide.position : canvas.width || 0}
            y2={guide.orientation === 'horizontal' ? guide.position : canvas.height || 0}
            stroke={guide.color || config.guideColor}
            strokeWidth={config.guideThickness}
            strokeDasharray={config.dashPattern?.join(' ')}
            opacity={0.5}
          />
        ))}
        
        {/* Render active guides (highlighted) */}
        {activeGuides.map(guide => (
          <line
            key={`active-${guide.id}`}
            x1={guide.orientation === 'vertical' ? guide.position : 0}
            y1={guide.orientation === 'horizontal' ? guide.position : 0}
            x2={guide.orientation === 'vertical' ? guide.position : canvas.width || 0}
            y2={guide.orientation === 'horizontal' ? guide.position : canvas.height || 0}
            stroke={guide.color || config.activeGuideColor}
            strokeWidth={config.guideThickness + 1}
            strokeDasharray={config.dashPattern?.join(' ')}
            opacity={0.9}
          />
        ))}
        
        {/* Render guide labels for active guides */}
        {activeGuides.map(guide => (
          guide.label ? (
            <text
              key={`label-${guide.id}`}
              x={guide.orientation === 'vertical' ? guide.position + 5 : 10}
              y={guide.orientation === 'horizontal' ? guide.position - 5 : 15}
              fontSize="10"
              fill={guide.color || config.activeGuideColor}
              opacity={0.9}
            >
              {guide.label}
            </text>
          ) : null
        ))}
      </svg>
      
      {/* Render distance indicators */}
      {distanceIndicators.map(indicator => (
        <DistanceIndicatorComponent
          key={indicator.id}
          indicator={indicator}
        />
      ))}
    </>
  );
};

export default SmartGuideSystem;
