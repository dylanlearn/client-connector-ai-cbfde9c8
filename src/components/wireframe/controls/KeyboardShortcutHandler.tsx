
import { useEffect, useCallback, useRef } from 'react';
import { fabric } from 'fabric';
import { useToast } from '@/hooks/use-toast';

interface KeyboardShortcutHandlerProps {
  canvas: fabric.Canvas | null;
  enabled?: boolean;
  onDuplicate?: () => void;
  onDelete?: () => void;
  onGroup?: () => void;
  onUngroup?: () => void;
  onLockToggle?: () => void;
  onBringForward?: () => void;
  onSendBackward?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  keyboardMovementStep?: number;
}

const KeyboardShortcutHandler: React.FC<KeyboardShortcutHandlerProps> = ({
  canvas,
  enabled = true,
  onDuplicate,
  onDelete,
  onGroup,
  onUngroup,
  onLockToggle,
  onBringForward,
  onSendBackward,
  onUndo,
  onRedo,
  keyboardMovementStep = 1,
}) => {
  const { toast } = useToast();
  const keysDown = useRef<Set<string>>(new Set());
  
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!enabled || !canvas) return;
    
    // Skip if we're in an input field
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return;
    }
    
    keysDown.current.add(e.key.toLowerCase());
    const activeObject = canvas.getActiveObject();
    
    // Ctrl combinations
    if (e.ctrlKey || e.metaKey) {
      // Ctrl+D: Duplicate
      if (e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        if (onDuplicate && activeObject) {
          onDuplicate();
        }
        return;
      }
      
      // Ctrl+G: Group
      if (e.key === 'g' || e.key === 'G') {
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
      if (e.key === 'l' || e.key === 'L') {
        e.preventDefault();
        if (onLockToggle && activeObject) {
          onLockToggle();
        }
        return;
      }
      
      // Ctrl+]: Bring forward
      if (e.key === ']') {
        e.preventDefault();
        if (onBringForward && activeObject) {
          onBringForward();
        }
        return;
      }
      
      // Ctrl+[: Send backward
      if (e.key === '[') {
        e.preventDefault();
        if (onSendBackward && activeObject) {
          onSendBackward();
        }
        return;
      }
      
      // Ctrl+Z: Undo
      if ((e.key === 'z' || e.key === 'Z') && !e.shiftKey) {
        e.preventDefault();
        if (onUndo) {
          onUndo();
        }
        return;
      }
      
      // Ctrl+Y or Ctrl+Shift+Z: Redo
      if ((e.key === 'y' || e.key === 'Y') || ((e.key === 'z' || e.key === 'Z') && e.shiftKey)) {
        e.preventDefault();
        if (onRedo) {
          onRedo();
        }
        return;
      }
    }
    
    // Regular keys
    
    // Delete or Backspace: Delete selected objects
    if ((e.key === 'Delete' || e.key === 'Backspace') && activeObject) {
      e.preventDefault();
      if (onDelete) {
        onDelete();
      }
      return;
    }
    
    // Arrow keys: Move objects
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key) && activeObject) {
      e.preventDefault();
      
      // Calculate movement step (larger step with shift key)
      const step = e.shiftKey ? keyboardMovementStep * 10 : keyboardMovementStep;
      
      switch (e.key) {
        case 'ArrowUp':
          activeObject.top! -= step;
          break;
        case 'ArrowDown':
          activeObject.top! += step;
          break;
        case 'ArrowLeft':
          activeObject.left! -= step;
          break;
        case 'ArrowRight':
          activeObject.left! += step;
          break;
      }
      
      activeObject.setCoords();
      canvas.renderAll();
      canvas.trigger('object:modified', { target: activeObject });
    }
  }, [canvas, enabled, keyboardMovementStep, onBringForward, onDelete, onDuplicate, onGroup, onLockToggle, onRedo, onSendBackward, onUndo, onUngroup]);
  
  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    keysDown.current.delete(e.key.toLowerCase());
  }, []);
  
  // Set up keyboard event listeners
  useEffect(() => {
    if (!enabled) return;
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [enabled, handleKeyDown, handleKeyUp]);
  
  // This component doesn't render anything visible
  return null;
};

export default KeyboardShortcutHandler;
