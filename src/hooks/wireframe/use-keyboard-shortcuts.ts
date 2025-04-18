
import { useCallback, useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { useToast } from '@/components/ui/use-toast';

export interface KeyboardShortcutsConfig {
  enabled?: boolean;
  movementStep?: number;
  snappingEnabled?: boolean;
  preventDefaultKeys?: boolean;
}

interface KeyCombination {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
}

interface ShortcutAction {
  name: string;
  description: string;
  keyCombination: KeyCombination;
  action: () => void;
}

export function useKeyboardShortcuts({
  canvas,
  config = {},
  onDuplicate,
  onDelete,
  onGroup,
  onUngroup,
  onLockToggle,
  onBringForward,
  onSendBackward,
  onUndo,
  onRedo,
}: {
  canvas: fabric.Canvas | null;
  config?: KeyboardShortcutsConfig;
  onDuplicate?: () => void;
  onDelete?: () => void;
  onGroup?: () => void;
  onUngroup?: () => void;
  onLockToggle?: () => void;
  onBringForward?: () => void;
  onSendBackward?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
}) {
  const { toast } = useToast();
  const keysDown = useRef<Set<string>>(new Set());
  const shortcutsEnabled = useRef<boolean>(config.enabled !== false);
  const movementStep = useRef<number>(config.movementStep || 1);
  const snappingEnabled = useRef<boolean>(config.snappingEnabled !== false);
  const preventDefaultKeys = useRef<boolean>(config.preventDefaultKeys !== false);
  
  // Track registered keyboard shortcuts
  const shortcuts = useRef<ShortcutAction[]>([]);
  
  // Register a new keyboard shortcut
  const registerShortcut = useCallback((shortcut: ShortcutAction) => {
    shortcuts.current.push(shortcut);
  }, []);
  
  // Remove a keyboard shortcut
  const unregisterShortcut = useCallback((name: string) => {
    shortcuts.current = shortcuts.current.filter(s => s.name !== name);
  }, []);
  
  // Check if a key combination matches the current key state
  const matchesKeyCombination = useCallback((combo: KeyCombination, event: KeyboardEvent): boolean => {
    const keyMatches = event.key.toLowerCase() === combo.key.toLowerCase();
    const ctrlMatches = !!combo.ctrl === (event.ctrlKey || event.metaKey);
    const altMatches = !!combo.alt === event.altKey;
    const shiftMatches = !!combo.shift === event.shiftKey;
    
    return keyMatches && ctrlMatches && altMatches && shiftMatches;
  }, []);
  
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!shortcutsEnabled.current || !canvas) return;
    
    // Skip if we're in an input field
    if (e.target instanceof HTMLInputElement || 
        e.target instanceof HTMLTextAreaElement || 
        e.target instanceof HTMLSelectElement) {
      return;
    }
    
    const key = e.key.toLowerCase();
    keysDown.current.add(key);
    
    // Check for registered shortcuts
    for (const shortcut of shortcuts.current) {
      if (matchesKeyCombination(shortcut.keyCombination, e)) {
        if (preventDefaultKeys.current) {
          e.preventDefault();
        }
        shortcut.action();
        return;
      }
    }
    
    const activeObject = canvas.getActiveObject();
    
    // Default shortcuts
    
    // Ctrl combinations
    if (e.ctrlKey || e.metaKey) {
      // Ctrl+D: Duplicate
      if (key === 'd') {
        e.preventDefault();
        if (onDuplicate && activeObject) {
          onDuplicate();
        }
        return;
      }
      
      // Ctrl+G: Group
      if (key === 'g') {
        e.preventDefault();
        if (e.shiftKey) {
          // Ctrl+Shift+G: Ungroup
          if (onUngroup && activeObject) {
            onUngroup();
          }
        } else {
          // Ctrl+G: Group
          if (onGroup && activeObject && activeObject.type === 'activeSelection') {
            onGroup();
          }
        }
        return;
      }
      
      // Ctrl+L: Toggle lock
      if (key === 'l') {
        e.preventDefault();
        if (onLockToggle && activeObject) {
          onLockToggle();
        }
        return;
      }
      
      // Ctrl+]: Bring forward
      if (key === ']') {
        e.preventDefault();
        if (onBringForward && activeObject) {
          onBringForward();
        }
        return;
      }
      
      // Ctrl+[: Send backward
      if (key === '[') {
        e.preventDefault();
        if (onSendBackward && activeObject) {
          onSendBackward();
        }
        return;
      }
      
      // Ctrl+Z: Undo
      if (key === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (onUndo) {
          onUndo();
        }
        return;
      }
      
      // Ctrl+Y or Ctrl+Shift+Z: Redo
      if (key === 'y' || (key === 'z' && e.shiftKey)) {
        e.preventDefault();
        if (onRedo) {
          onRedo();
        }
        return;
      }
    }
    
    // Regular keys
    
    // Delete or Backspace: Delete selected objects
    if ((key === 'delete' || key === 'backspace') && activeObject) {
      e.preventDefault();
      if (onDelete) {
        onDelete();
      }
      return;
    }
    
    // Arrow keys: Move objects
    if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key) && activeObject) {
      e.preventDefault();
      
      // Calculate movement step (larger step with shift key)
      const step = e.shiftKey ? movementStep.current * 10 : movementStep.current;
      
      switch (key) {
        case 'arrowup':
          activeObject.top! -= step;
          break;
        case 'arrowdown':
          activeObject.top! += step;
          break;
        case 'arrowleft':
          activeObject.left! -= step;
          break;
        case 'arrowright':
          activeObject.left! += step;
          break;
      }
      
      activeObject.setCoords();
      canvas.renderAll();
      canvas.trigger('object:modified', { target: activeObject });
    }
  }, [canvas, matchesKeyCombination, onBringForward, onDelete, onDuplicate, onGroup, onLockToggle, onRedo, onSendBackward, onUndo, onUngroup]);
  
  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    keysDown.current.delete(e.key.toLowerCase());
  }, []);
  
  // Configure keyboard shortcuts
  const configure = useCallback((newConfig: KeyboardShortcutsConfig) => {
    if ('enabled' in newConfig) shortcutsEnabled.current = newConfig.enabled !== false;
    if ('movementStep' in newConfig) movementStep.current = newConfig.movementStep || 1;
    if ('snappingEnabled' in newConfig) snappingEnabled.current = newConfig.snappingEnabled !== false;
    if ('preventDefaultKeys' in newConfig) preventDefaultKeys.current = newConfig.preventDefaultKeys !== false;
  }, []);
  
  // Helper to check if a key is currently pressed
  const isKeyPressed = useCallback((key: string): boolean => {
    return keysDown.current.has(key.toLowerCase());
  }, []);
  
  // Helper to check if multiple keys are currently pressed
  const areKeysPressed = useCallback((keys: string[]): boolean => {
    return keys.every(key => keysDown.current.has(key.toLowerCase()));
  }, []);
  
  // Show toast with active keyboard shortcuts
  const showShortcutsHelp = useCallback(() => {
    if (shortcuts.current.length === 0) {
      toast({
        title: "Keyboard Shortcuts",
        description: "No custom shortcuts registered",
      });
      return;
    }
    
    // Format shortcuts for display
    const shortcutsList = shortcuts.current.map(shortcut => {
      let combo = '';
      if (shortcut.keyCombination.ctrl) combo += 'Ctrl+';
      if (shortcut.keyCombination.alt) combo += 'Alt+';
      if (shortcut.keyCombination.shift) combo += 'Shift+';
      combo += shortcut.keyCombination.key.toUpperCase();
      
      return `${combo}: ${shortcut.description}`;
    }).join('\n');
    
    toast({
      title: "Keyboard Shortcuts",
      description: shortcutsList,
    });
  }, [toast]);
  
  // Set up keyboard event listeners
  useEffect(() => {
    if (!shortcutsEnabled.current) return;
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    // Register default shortcuts
    const defaultShortcuts: ShortcutAction[] = [
      {
        name: 'help',
        description: 'Show keyboard shortcuts help',
        keyCombination: { key: '?', shift: true },
        action: showShortcutsHelp
      }
    ];
    
    shortcuts.current = [...shortcuts.current, ...defaultShortcuts];
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp, showShortcutsHelp]);
  
  return {
    registerShortcut,
    unregisterShortcut,
    isKeyPressed,
    areKeysPressed,
    showShortcutsHelp,
    configure,
    keysDown: keysDown.current
  };
}
