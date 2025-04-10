
import { fabric } from 'fabric';
import { v4 as uuidv4 } from 'uuid';

interface ComponentRenderOptions {
  left: number;
  top: number;
  width: number;
  height: number;
  darkMode: boolean;
  sectionStyle: any;
  colorScheme?: any;
  deviceType: 'desktop' | 'tablet' | 'mobile';
}

/**
 * Creates a heading component
 */
const createHeadingComponent = (component: any, options: ComponentRenderOptions): fabric.Object => {
  const { left, top, width, height, darkMode, sectionStyle } = options;
  
  // Text settings based on heading level
  const level = component.level || component.props?.level || 1;
  const fontSize = 22 - ((level - 1) * 2); // h1: 22px, h2: 20px, etc.
  const fontWeight = level <= 2 ? 'bold' : 'normal';
  
  const text = new fabric.Text(component.content || component.props?.content || `Heading ${level}`, {
    left: 0,
    top: 0,
    width: width - 10,
    fontSize,
    fontFamily: 'Arial, sans-serif',
    fontWeight,
    fill: sectionStyle.textColor,
    textAlign: component.props?.textAlign || 'left'
  });
  
  return new fabric.Group([text], {
    left,
    top,
    data: {
      componentType: 'heading',
      level,
      id: component.id || uuidv4(),
      originalComponent: component
    }
  });
};

/**
 * Creates a text/paragraph component
 */
const createTextComponent = (component: any, options: ComponentRenderOptions): fabric.Object => {
  const { left, top, width, height, darkMode, sectionStyle } = options;
  
  const text = new fabric.Textbox(component.content || component.props?.content || 'Text content goes here. This is a paragraph of text that can wrap to multiple lines.', {
    left: 0,
    top: 0,
    width: width - 10,
    fontSize: component.props?.fontSize || 14,
    fontFamily: 'Arial, sans-serif',
    fill: sectionStyle.textColor,
    textAlign: component.props?.textAlign || 'left',
    lineHeight: 1.4
  });
  
  return new fabric.Group([text], {
    left,
    top,
    data: {
      componentType: 'text',
      id: component.id || uuidv4(),
      originalComponent: component
    }
  });
};

/**
 * Creates a button component
 */
const createButtonComponent = (component: any, options: ComponentRenderOptions): fabric.Object => {
  const { left, top, width, height, darkMode, sectionStyle, colorScheme } = options;
  
  // Button colors
  const buttonColor = component.props?.backgroundColor || 
    component.style?.backgroundColor || 
    (colorScheme?.primary || '#3b82f6');
  
  const buttonTextColor = component.props?.color || 
    component.style?.color ||
    (darkMode ? '#ffffff' : '#ffffff');
  
  // Create button rectangle
  const rect = new fabric.Rect({
    left: 0,
    top: 0,
    width: width,
    height: height,
    fill: buttonColor,
    stroke: component.props?.borderColor || 'transparent',
    strokeWidth: component.props?.borderWidth || 0,
    rx: component.props?.borderRadius || 4,
    ry: component.props?.borderRadius || 4
  });
  
  // Create button text
  const text = new fabric.Text(component.content || component.props?.label || 'Button', {
    left: width / 2,
    top: height / 2,
    fontSize: component.props?.fontSize || 14,
    fontFamily: 'Arial, sans-serif',
    fontWeight: 'bold',
    fill: buttonTextColor,
    originX: 'center',
    originY: 'center'
  });
  
  return new fabric.Group([rect, text], {
    left,
    top,
    data: {
      componentType: 'button',
      id: component.id || uuidv4(),
      originalComponent: component
    }
  });
};

/**
 * Creates an image component
 */
const createImageComponent = (component: any, options: ComponentRenderOptions): fabric.Object => {
  const { left, top, width, height, darkMode } = options;
  
  // Create image placeholder
  const rect = new fabric.Rect({
    left: 0,
    top: 0,
    width,
    height,
    fill: darkMode ? '#374151' : '#f3f4f6',
    stroke: darkMode ? '#4b5563' : '#d1d5db',
    strokeWidth: 1,
    rx: component.props?.borderRadius || 0,
    ry: component.props?.borderRadius || 0
  });
  
  // Create image icon
  const imageIcon = new fabric.Text('🖼️', {
    left: width / 2,
    top: height / 2 - 12,
    fontSize: 24,
    originX: 'center',
    originY: 'center'
  });
  
  // Create image label
  const label = new fabric.Text('Image', {
    left: width / 2,
    top: height / 2 + 15,
    fontSize: 12,
    fontFamily: 'Arial, sans-serif',
    fill: darkMode ? '#9ca3af' : '#6b7280',
    originX: 'center',
    originY: 'center'
  });
  
  return new fabric.Group([rect, imageIcon, label], {
    left,
    top,
    data: {
      componentType: 'image',
      id: component.id || uuidv4(),
      originalComponent: component
    }
  });
};

/**
 * Creates an input field component
 */
const createInputComponent = (component: any, options: ComponentRenderOptions): fabric.Object => {
  const { left, top, width, height, darkMode } = options;
  
  // Create input rectangle
  const rect = new fabric.Rect({
    left: 0,
    top: 0,
    width,
    height: 36,
    fill: darkMode ? '#374151' : '#ffffff',
    stroke: darkMode ? '#4b5563' : '#d1d5db',
    strokeWidth: 1,
    rx: 4,
    ry: 4
  });
  
  // Create placeholder text
  const placeholder = component.props?.placeholder || component.content || 'Input field';
  const placeholderText = new fabric.Text(placeholder, {
    left: 10,
    top: 10,
    fontSize: 14,
    fontFamily: 'Arial, sans-serif',
    fill: darkMode ? '#9ca3af' : '#9ca3af',
  });
  
  // Create label if specified
  let groupObjects = [rect, placeholderText];
  let totalHeight = 36;
  
  if (component.props?.label) {
    const label = new fabric.Text(component.props.label, {
      left: 0,
      top: -20,
      fontSize: 14,
      fontFamily: 'Arial, sans-serif',
      fontWeight: 'bold',
      fill: darkMode ? '#e5e7eb' : '#374151',
    });
    
    groupObjects.unshift(label);
    totalHeight += 20;
  }
  
  return new fabric.Group(groupObjects, {
    left,
    top,
    data: {
      componentType: 'input',
      id: component.id || uuidv4(),
      originalComponent: component
    }
  });
};

/**
 * Creates a navigation menu component
 */
const createNavComponent = (component: any, options: ComponentRenderOptions): fabric.Object => {
  const { left, top, width, darkMode } = options;
  
  const navItems = component.props?.items || ['Home', 'About', 'Features', 'Contact'];
  const navItemObjects: fabric.Object[] = [];
  let currentX = 0;
  
  // Create nav background
  const background = new fabric.Rect({
    left: 0,
    top: 0,
    width,
    height: 40,
    fill: 'transparent'
  });
  
  navItemObjects.push(background);
  
  // Create nav items
  navItems.forEach((item: string, index: number) => {
    const textItem = new fabric.Text(item, {
      left: currentX,
      top: 10,
      fontSize: 14,
      fontFamily: 'Arial, sans-serif',
      fontWeight: index === 0 ? 'bold' : 'normal',
      fill: darkMode ? '#e5e7eb' : '#374151'
    });
    
    navItemObjects.push(textItem);
    currentX += textItem.width! + 24;
  });
  
  return new fabric.Group(navItemObjects, {
    left,
    top,
    data: {
      componentType: 'nav',
      id: component.id || uuidv4(),
      originalComponent: component
    }
  });
};

/**
 * Creates a card component
 */
const createCardComponent = (component: any, options: ComponentRenderOptions): fabric.Object => {
  const { left, top, width, darkMode } = options;
  
  // Create card background
  const background = new fabric.Rect({
    left: 0,
    top: 0,
    width,
    height: 180,
    fill: darkMode ? '#1f2937' : '#ffffff',
    stroke: darkMode ? '#374151' : '#e5e7eb',
    strokeWidth: 1,
    rx: 5,
    ry: 5
  });
  
  // Create card elements
  const titleText = component.props?.title || component.content || 'Card Title';
  const title = new fabric.Text(titleText, {
    left: 16,
    top: 16,
    fontSize: 16,
    fontFamily: 'Arial, sans-serif',
    fontWeight: 'bold',
    fill: darkMode ? '#e5e7eb' : '#111827',
    width: width - 32
  });
  
  // Content text
  const contentText = component.props?.content || 'Card content goes here. This describes the card item in more detail.';
  const content = new fabric.Textbox(contentText, {
    left: 16,
    top: 45,
    fontSize: 14,
    fontFamily: 'Arial, sans-serif',
    fill: darkMode ? '#d1d5db' : '#4b5563',
    width: width - 32,
    lineHeight: 1.4
  });
  
  // Action button
  const buttonLabel = component.props?.buttonText || 'Learn More';
  const button = new fabric.Group([
    new fabric.Rect({
      left: 0,
      top: 0,
      width: 100,
      height: 32,
      fill: darkMode ? '#2563eb' : '#3b82f6',
      rx: 4,
      ry: 4
    }),
    new fabric.Text(buttonLabel, {
      left: 50,
      top: 16,
      fontSize: 14,
      fontFamily: 'Arial, sans-serif',
      fontWeight: 'bold',
      fill: '#ffffff',
      originX: 'center',
      originY: 'center'
    })
  ], {
    left: 16,
    top: 130
  });
  
  return new fabric.Group([background, title, content, button], {
    left,
    top,
    data: {
      componentType: 'card',
      id: component.id || uuidv4(),
      originalComponent: component
    }
  });
};

/**
 * Creates a container/box component
 */
const createContainerComponent = (component: any, options: ComponentRenderOptions): fabric.Object => {
  const { left, top, width, height, darkMode } = options;
  
  // Create container background
  const background = new fabric.Rect({
    left: 0,
    top: 0,
    width,
    height: height || 100,
    fill: darkMode ? 'rgba(31, 41, 55, 0.4)' : 'rgba(249, 250, 251, 0.8)',
    stroke: darkMode ? '#374151' : '#e5e7eb',
    strokeWidth: 1,
    rx: component.props?.borderRadius || 0,
    ry: component.props?.borderRadius || 0
  });
  
  // Only add label if it has a name
  let groupObjects = [background];
  
  if (component.name || component.props?.label) {
    const label = new fabric.Text(component.name || component.props?.label || 'Container', {
      left: 8,
      top: 8,
      fontSize: 12,
      fontFamily: 'Arial, sans-serif',
      fill: darkMode ? '#9ca3af' : '#6b7280'
    });
    
    groupObjects.push(label);
  }
  
  return new fabric.Group(groupObjects, {
    left,
    top,
    data: {
      componentType: 'container',
      id: component.id || uuidv4(),
      originalComponent: component
    }
  });
};

/**
 * Creates a form component
 */
const createFormComponent = (component: any, options: ComponentRenderOptions): fabric.Object => {
  const { left, top, width, darkMode } = options;
  
  // Form background
  const background = new fabric.Rect({
    left: 0,
    top: 0,
    width,
    height: 220,
    fill: darkMode ? '#1f2937' : '#f9fafb',
    stroke: darkMode ? '#374151' : '#e5e7eb',
    strokeWidth: 1,
    rx: 6,
    ry: 6
  });
  
  // Form title
  const title = new fabric.Text(component.props?.title || 'Form Title', {
    left: 20,
    top: 20,
    fontSize: 18,
    fontFamily: 'Arial, sans-serif',
    fontWeight: 'bold',
    fill: darkMode ? '#e5e7eb' : '#111827'
  });
  
  // Form fields - simplified representation
  const field1Label = new fabric.Text('Field 1', {
    left: 20,
    top: 60,
    fontSize: 14,
    fontFamily: 'Arial, sans-serif',
    fill: darkMode ? '#e5e7eb' : '#374151'
  });
  
  const field1 = new fabric.Rect({
    left: 20,
    top: 80,
    width: width - 40,
    height: 36,
    fill: darkMode ? '#374151' : '#ffffff',
    stroke: darkMode ? '#4b5563' : '#d1d5db',
    strokeWidth: 1,
    rx: 4,
    ry: 4
  });
  
  const field2Label = new fabric.Text('Field 2', {
    left: 20,
    top: 130,
    fontSize: 14,
    fontFamily: 'Arial, sans-serif',
    fill: darkMode ? '#e5e7eb' : '#374151'
  });
  
  const field2 = new fabric.Rect({
    left: 20,
    top: 150,
    width: width - 40,
    height: 36,
    fill: darkMode ? '#374151' : '#ffffff',
    stroke: darkMode ? '#4b5563' : '#d1d5db',
    strokeWidth: 1,
    rx: 4,
    ry: 4
  });
  
  return new fabric.Group([background, title, field1Label, field1, field2Label, field2], {
    left,
    top,
    data: {
      componentType: 'form',
      id: component.id || uuidv4(),
      originalComponent: component
    }
  });
};

/**
 * Component type mapping to rendering functions
 */
export const COMPONENT_TYPE_MAPPING: Record<string, (component: any, options: ComponentRenderOptions) => fabric.Object> = {
  // Text elements
  'heading': createHeadingComponent,
  'h1': createHeadingComponent,
  'h2': createHeadingComponent,
  'h3': createHeadingComponent,
  'h4': createHeadingComponent,
  'h5': createHeadingComponent,
  'h6': createHeadingComponent,
  'text': createTextComponent,
  'paragraph': createTextComponent,
  'p': createTextComponent,
  
  // Interactive elements
  'button': createButtonComponent,
  'input': createInputComponent,
  'form': createFormComponent,
  
  // Content containers
  'image': createImageComponent,
  'img': createImageComponent,
  'card': createCardComponent,
  'container': createContainerComponent,
  'div': createContainerComponent,
  'box': createContainerComponent,
  'section': createContainerComponent,
  
  // Navigation
  'nav': createNavComponent,
  'menu': createNavComponent,
  'navigation': createNavComponent
};
