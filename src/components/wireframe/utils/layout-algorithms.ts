
// Helper function to convert a value to a number safely
const toNumber = (value: string | number | undefined, defaultValue: number = 0): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? defaultValue : parsed;
  }
  return defaultValue;
};

// Calculate layout of elements in a row
export const calculateRowLayout = (
  containerWidth: number,
  items: { width: string | number; height: string | number }[],
  gap: number = 10,
  padLeft: number = 0,
  padRight: number = 0
): { x: number; y: number; width: number; height: number }[] => {
  const effectiveWidth = containerWidth - padLeft - padRight;
  let currentX = padLeft;
  let currentY = 0;
  let rowHeight = 0;
  
  return items.map(item => {
    // Convert dimensions to numbers
    const itemWidth = toNumber(item.width);
    const itemHeight = toNumber(item.height);
    
    // Check if the item needs to wrap to the next row
    if (currentX + itemWidth > effectiveWidth + padLeft && currentX > padLeft) {
      currentX = padLeft;
      currentY += rowHeight + gap;
      rowHeight = 0;
    }
    
    // Update the row height if this item is taller
    rowHeight = Math.max(rowHeight, itemHeight);
    
    // Set the item position
    const position = {
      x: currentX,
      y: currentY,
      width: itemWidth,
      height: itemHeight
    };
    
    // Move the cursor for the next item
    currentX += itemWidth + gap;
    
    return position;
  });
};

// Calculate layout for grid elements
export const calculateGridLayout = (
  containerWidth: number,
  items: { width: string | number; height: string | number }[],
  columns: number = 3,
  gap: number = 10,
  padLeft: number = 0,
  padRight: number = 0
): { x: number; y: number; width: number; height: number }[] => {
  // Calculate column width
  const effectiveWidth = containerWidth - padLeft - padRight - (gap * (columns - 1));
  const columnWidth = effectiveWidth / columns;
  
  return items.map((item, index) => {
    // Convert height to number
    const itemHeight = toNumber(item.height);
    
    // Calculate the column and row for this index
    const column = index % columns;
    const row = Math.floor(index / columns);
    
    // Calculate x and y positions
    const x = padLeft + (column * (columnWidth + gap));
    const y = row * (itemHeight + gap);
    
    return {
      x,
      y,
      width: columnWidth,
      height: itemHeight
    };
  });
};

// Calculate layout for a vertical stack
export const calculateStackLayout = (
  items: { width: string | number; height: string | number }[],
  gap: number = 10,
  padLeft: number = 0,
  padTop: number = 0
): { x: number; y: number; width: number; height: number }[] => {
  let currentY = padTop;
  
  return items.map(item => {
    // Convert dimensions to numbers
    const itemWidth = toNumber(item.width);
    const itemHeight = toNumber(item.height);
    
    // Set the item position
    const position = {
      x: padLeft,
      y: currentY,
      width: itemWidth,
      height: itemHeight
    };
    
    // Move the cursor for the next item
    currentY += itemHeight + gap;
    
    return position;
  });
};

// Calculate the total height needed for a layout
export const calculateTotalHeight = (
  layout: { x: number; y: number; width: number; height: number }[]
): number => {
  if (layout.length === 0) return 0;
  
  let maxHeight = 0;
  
  layout.forEach(item => {
    maxHeight = Math.max(maxHeight, item.y + item.height);
  });
  
  return maxHeight;
};
