
import React from 'react';
import { cn } from '@/lib/utils';
import { BaseComponentRendererProps } from './BaseComponentRenderer';
import { ComponentRendererFactory } from '../ComponentRendererFactory';

/**
 * Specialized renderer for list components (ul, ol, menu)
 */
const ListComponentRenderer: React.FC<BaseComponentRendererProps> = ({
  component,
  darkMode = false,
  interactive = false,
  onClick,
  isSelected = false,
  deviceType = 'desktop',
}) => {
  const handleClick = (e: React.MouseEvent) => {
    if (interactive && onClick && component.id && e.target === e.currentTarget) {
      onClick(component.id);
    }
  };

  // Extract list styles
  const {
    listStyleType = component.type === 'ol' ? 'decimal' : component.type === 'menu' ? 'none' : 'disc',
    gap = '0.5rem',
    width = '100%',
    height = 'auto',
  } = component.style || {};

  // Generate list items if they don't exist
  const listItems = component.children && component.children.length > 0 
    ? component.children 
    : component.props?.items && Array.isArray(component.props.items)
      ? component.props.items.map((item: string, idx: number) => ({
          id: `${component.id}-item-${idx}`,
          type: 'text',
          content: item
        }))
      : [
          { id: `${component.id}-item-1`, type: 'text', content: 'List Item 1' },
          { id: `${component.id}-item-2`, type: 'text', content: 'List Item 2' },
          { id: `${component.id}-item-3`, type: 'text', content: 'List Item 3' },
        ];

  const ListTag = component.type === 'ol' ? 'ol' : 'ul';

  return (
    <div 
      className={cn(
        "wireframe-list-component",
        isSelected && "ring-2 ring-primary",
        interactive && "cursor-pointer"
      )}
      style={{ width, height }}
      onClick={handleClick}
      data-component-id={component.id}
      data-component-type={component.type}
    >
      <ListTag 
        className={cn(
          "list-inside", 
          listStyleType !== 'none' ? `list-${listStyleType}` : '',
          "space-y-2"
        )}
        style={{ gap }}
      >
        {listItems.map((item: any, idx: number) => (
          <li key={item.id || idx} className={cn(
            component.type === 'menu' && "menu-item cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2 rounded-md",
            darkMode ? "text-white" : "text-gray-900"
          )}>
            {item.type ? (
              <ComponentRendererFactory
                component={item}
                darkMode={darkMode}
                interactive={interactive}
                onClick={onClick}
                deviceType={deviceType}
              />
            ) : (
              <span>{item.content || `List Item ${idx + 1}`}</span>
            )}
          </li>
        ))}
      </ListTag>
    </div>
  );
};

export default ListComponentRenderer;
