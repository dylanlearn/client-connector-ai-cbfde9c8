
import React from 'react';

export interface StylePresetConfig {
  id: string;
  name: string;
  defaultStyles: string;
  hoverStyles: string;
  activeStyles: string;
  focusStyles: string;
  disabledStyles: string;
}

/**
 * Collection of predefined style presets for common UI patterns
 */
export const stylePresets: StylePresetConfig[] = [
  {
    id: 'subtle-button',
    name: 'Subtle Button',
    defaultStyles: 'bg-gray-100 text-gray-800 py-2 px-4 rounded',
    hoverStyles: 'bg-gray-200 text-gray-900',
    activeStyles: 'bg-gray-300 text-gray-900 transform scale-95',
    focusStyles: 'ring-2 ring-offset-2 ring-gray-400 outline-none',
    disabledStyles: 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-70',
  },
  {
    id: 'primary-button',
    name: 'Primary Button',
    defaultStyles: 'bg-blue-600 text-white py-2 px-4 rounded',
    hoverStyles: 'bg-blue-700 shadow-md',
    activeStyles: 'bg-blue-800 transform scale-95',
    focusStyles: 'ring-2 ring-offset-2 ring-blue-400 outline-none',
    disabledStyles: 'bg-blue-300 cursor-not-allowed opacity-70',
  },
  {
    id: 'ghost-button',
    name: 'Ghost Button',
    defaultStyles: 'bg-transparent text-gray-700 py-2 px-4 border border-transparent',
    hoverStyles: 'bg-gray-100 border-gray-200',
    activeStyles: 'bg-gray-200 transform scale-95',
    focusStyles: 'ring-2 ring-gray-300 outline-none',
    disabledStyles: 'text-gray-300 cursor-not-allowed opacity-70',
  },
  {
    id: 'text-input',
    name: 'Text Input',
    defaultStyles: 'border border-gray-300 rounded px-3 py-2 w-full text-gray-700',
    hoverStyles: 'border-gray-400',
    activeStyles: 'border-blue-500',
    focusStyles: 'border-blue-500 ring-2 ring-blue-200 outline-none',
    disabledStyles: 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed',
  },
  {
    id: 'card',
    name: 'Card',
    defaultStyles: 'bg-white border border-gray-200 rounded-lg p-4 shadow-sm',
    hoverStyles: 'shadow-md border-gray-300',
    activeStyles: 'transform scale-[0.99] shadow-inner',
    focusStyles: 'ring-2 ring-blue-200 outline-none',
    disabledStyles: 'opacity-70 bg-gray-50',
  },
  {
    id: 'nav-link',
    name: 'Navigation Link',
    defaultStyles: 'text-gray-700 hover:text-blue-600 px-3 py-2',
    hoverStyles: 'text-blue-600 underline',
    activeStyles: 'text-blue-800 font-medium',
    focusStyles: 'outline-2 outline-offset-2 outline-blue-300',
    disabledStyles: 'text-gray-400 cursor-not-allowed',
  }
];

/**
 * Retrieves a style preset by its ID
 */
export function getPresetById(presetId: string): StylePresetConfig | undefined {
  return stylePresets.find(preset => preset.id === presetId);
}

/**
 * Component to render a style preset demonstration
 */
export function PresetStyleDemo({
  presetId,
  children
}: {
  presetId: string;
  children?: React.ReactNode;
}) {
  const preset = getPresetById(presetId);
  
  if (!preset) {
    return <div>Preset not found: {presetId}</div>;
  }

  // Default elements based on preset type
  const defaultElement = (() => {
    switch (presetId) {
      case 'text-input':
        return <input type="text" placeholder="Input field" className={preset.defaultStyles} />;
      case 'card':
        return (
          <div className={preset.defaultStyles}>
            <h3 className="text-lg font-medium">Card Title</h3>
            <p className="text-sm text-gray-600 mt-1">Card content goes here</p>
          </div>
        );
      case 'nav-link':
        return <a href="#" className={preset.defaultStyles}>Navigation Link</a>;
      default:
        return <button className={preset.defaultStyles}>Button Text</button>;
    }
  })();

  return children || defaultElement;
}
