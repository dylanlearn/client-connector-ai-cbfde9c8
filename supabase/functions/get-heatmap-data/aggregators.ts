
/**
 * Types for heatmap data points and events
 */
interface HeatmapDataPoint {
  x: number;
  y: number;
  value: number;
  elements?: string[];
  timestamp?: string;
}

interface InteractionEvent {
  x_position: number;
  y_position: number;
  element_selector?: string;
  timestamp: string;
}

/**
 * Aggregate events by point density
 */
export function aggregateByDensity(events: InteractionEvent[]): HeatmapDataPoint[] {
  // Group events by position (rounded to nearest 10px)
  const positionGrid: Record<string, { x: number, y: number, value: number, elements: string[] }> = {};
  
  events.forEach(event => {
    // Round positions to create a grid
    const gridX = Math.round(event.x_position / 10) * 10;
    const gridY = Math.round(event.y_position / 10) * 10;
    const key = `${gridX},${gridY}`;
    
    if (!positionGrid[key]) {
      positionGrid[key] = {
        x: gridX,
        y: gridY,
        value: 0,
        elements: []
      };
    }
    
    positionGrid[key].value += 1;
    
    if (event.element_selector && !positionGrid[key].elements.includes(event.element_selector)) {
      positionGrid[key].elements.push(event.element_selector);
    }
  });
  
  return Object.values(positionGrid);
}

/**
 * Aggregate events by element
 */
export function aggregateByElement(events: InteractionEvent[]): HeatmapDataPoint[] {
  // Group events by element
  const elementMap: Record<string, { element: string, value: number, x: number, y: number }> = {};
  
  events.forEach(event => {
    const element = event.element_selector || 'unknown';
    
    if (!elementMap[element]) {
      elementMap[element] = {
        element,
        value: 0,
        x: 0,
        y: 0
      };
    }
    
    elementMap[element].value += 1;
    elementMap[element].x += event.x_position;
    elementMap[element].y += event.y_position;
  });
  
  // Calculate average positions
  Object.values(elementMap).forEach(item => {
    if (item.value > 0) {
      item.x = Math.round(item.x / item.value);
      item.y = Math.round(item.y / item.value);
    }
  });
  
  return Object.values(elementMap);
}

/**
 * Aggregate events by time
 */
export function aggregateByTime(events: InteractionEvent[]): HeatmapDataPoint[] {
  // Sort events by timestamp
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
  
  // Group by time intervals (hourly)
  const timeIntervals: Record<string, { timestamp: string, value: number, x: number, y: number, elements: string[] }> = {};
  
  sortedEvents.forEach(event => {
    const date = new Date(event.timestamp);
    date.setMinutes(0, 0, 0); // Round to hour
    const interval = date.toISOString();
    
    if (!timeIntervals[interval]) {
      timeIntervals[interval] = {
        timestamp: interval,
        value: 0,
        x: 0,
        y: 0,
        elements: []
      };
    }
    
    timeIntervals[interval].value += 1;
    timeIntervals[interval].x += event.x_position;
    timeIntervals[interval].y += event.y_position;
    
    if (event.element_selector && !timeIntervals[interval].elements.includes(event.element_selector)) {
      timeIntervals[interval].elements.push(event.element_selector);
    }
  });
  
  // Calculate average positions
  Object.values(timeIntervals).forEach(item => {
    if (item.value > 0) {
      item.x = Math.round(item.x / item.value);
      item.y = Math.round(item.y / item.value);
    }
  });
  
  return Object.values(timeIntervals);
}
