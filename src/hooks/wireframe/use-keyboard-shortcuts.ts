
import { useCallback, useEffect } from 'react';
import { fabric } from 'fabric';
import { useToast } from '@/hooks/use-toast';

type KeyAction = {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  description: string;
  action: () => void;
};

type KeyboardShortcutsOptions = {
  canvas: fabric.Canvas | null;
  enabled?: boolean;
  skipOnInput?: boolean;
  onDuplicate?: () => void;
  onDelete?: () => void;
  onGroup?: () => void;
  onUngroup?: () => void;
  onLockToggle?: () => void;
  onBringForward?: () => void;
  onSendBackward?: () => void;
  onBringToFront?: () => void;
  onSendToBack?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onSave?: () => void;
  onSelectAll?: () => void;
  onCopy?: () => void;
  onPaste?: () => void;
  onCut?: () => void;
  onEscape?: () => void;
  keyboardMovementStep?: number;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onZoomReset?: () => void;
  onToggleGrid?: () => void;
  onToggleRulers?: () => void;
  onCustomAction?: (actionId: string) => void;
  customShortcuts?: KeyAction[];
};

/**
 * Hook for managing keyboard shortcuts in canvas applications
 */
export function useKeyboardShortcuts({
  canvas,
  enabled = true,
  skipOnInput = true,
  onDuplicate,
  onDelete,
  onGroup,
  onUngroup,
  onLockToggle,
  onBringForward,
  onSendBackward,
  onBringToFront,
  onSendToBack,
  onUndo,
  onRedo,
  onSave,
  onSelectAll,
  onCopy,
  onPaste,
  onCut,
  onEscape,
  keyboardMovementStep = 1,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onToggleGrid,
  onToggleRulers,
  onCustomAction,
  customShortcuts = []
}: KeyboardShortcutsOptions) {
  const { toast } = useToast();
  
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled || !canvas) return;

      // Skip if target is an input element and skipOnInput is true
      if (
        skipOnInput &&
        (e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement)
      ) {
        return;
      }

      const activeObject = canvas.getActiveObject();
      const ctrlKey = e.ctrlKey || e.metaKey;
      const altKey = e.altKey;
      const shiftKey = e.shiftKey;

      // Process custom shortcuts first
      for (const shortcut of customShortcuts) {
        if (
          e.key.toLowerCase() === shortcut.key.toLowerCase() &&
          (shortcut.ctrl === undefined || shortcut.ctrl === ctrlKey) &&
          (shortcut.alt === undefined || shortcut.alt === altKey) &&
          (shortcut.shift === undefined || shortcut.shift === shiftKey)
        ) {
          e.preventDefault();
          shortcut.action();
          return;
        }
      }

      // Ctrl combinations
      if (ctrlKey) {
        // Ctrl+D: Duplicate
        if (e.key === 'd' || e.key === 'D') {
          e.preventDefault();
          if (onDuplicate && activeObject) {
            onDuplicate();
            return;
          }
        }

        // Ctrl+G: Group
        if (e.key === 'g' || e.key === 'G') {
          e.preventDefault();
          if (shiftKey) {
            // Ctrl+Shift+G: Ungroup
            if (onUngroup && activeObject) {
              onUngroup();
              return;
            }
          } else {
            // Ctrl+G: Group
            if (onGroup && activeObject && activeObject.type === 'activeSelection') {
              onGroup();
              return;
            }
          }
        }

        // Ctrl+L: Toggle lock
        if (e.key === 'l' || e.key === 'L') {
          e.preventDefault();
          if (onLockToggle && activeObject) {
            onLockToggle();
            return;
          }
        }

        // Ctrl+]: Bring forward
        if (e.key === ']') {
          e.preventDefault();
          if (onBringForward && activeObject) {
            onBringForward();
            return;
          }
        }

        // Ctrl+[: Send backward
        if (e.key === '[') {
          e.preventDefault();
          if (onSendBackward && activeObject) {
            onSendBackward();
            return;
          }
        }

        // Ctrl+Shift+]: Bring to front
        if (e.key === ']' && shiftKey) {
          e.preventDefault();
          if (onBringToFront && activeObject) {
            onBringToFront();
            return;
          }
        }

        // Ctrl+Shift+[: Send to back
        if (e.key === '[' && shiftKey) {
          e.preventDefault();
          if (onSendToBack && activeObject) {
            onSendToBack();
            return;
          }
        }

        // Ctrl+Z: Undo
        if ((e.key === 'z' || e.key === 'Z') && !shiftKey) {
          e.preventDefault();
          if (onUndo) {
            onUndo();
            return;
          }
        }

        // Ctrl+Y or Ctrl+Shift+Z: Redo
        if (
          (e.key === 'y' || e.key === 'Y') ||
          ((e.key === 'z' || e.key === 'Z') && shiftKey)
        ) {
          e.preventDefault();
          if (onRedo) {
            onRedo();
            return;
          }
        }

        // Ctrl+S: Save
        if (e.key === 's' || e.key === 'S') {
          e.preventDefault();
          if (onSave) {
            onSave();
            return;
          }
        }

        // Ctrl+A: Select All
        if (e.key === 'a' || e.key === 'A') {
          e.preventDefault();
          if (onSelectAll) {
            onSelectAll();
            return;
          }
        }

        // Ctrl+C: Copy
        if (e.key === 'c' || e.key === 'C') {
          if (onCopy && activeObject) {
            onCopy();
            return;
          }
        }

        // Ctrl+V: Paste
        if (e.key === 'v' || e.key === 'V') {
          if (onPaste) {
            onPaste();
            return;
          }
        }

        // Ctrl+X: Cut
        if (e.key === 'x' || e.key === 'X') {
          if (onCut && activeObject) {
            onCut();
            return;
          }
        }

        // Ctrl++: Zoom In
        if (e.key === '+' || e.key === '=') {
          e.preventDefault();
          if (onZoomIn) {
            onZoomIn();
            return;
          }
        }

        // Ctrl+-: Zoom Out
        if (e.key === '-' || e.key === '_') {
          e.preventDefault();
          if (onZoomOut) {
            onZoomOut();
            return;
          }
        }

        // Ctrl+0: Reset Zoom
        if (e.key === '0') {
          e.preventDefault();
          if (onZoomReset) {
            onZoomReset();
            return;
          }
        }
      }

      // Alt combinations
      if (altKey) {
        // Alt+G: Toggle Grid
        if (e.key === 'g' || e.key === 'G') {
          e.preventDefault();
          if (onToggleGrid) {
            onToggleGrid();
            return;
          }
        }

        // Alt+R: Toggle Rulers
        if (e.key === 'r' || e.key === 'R') {
          e.preventDefault();
          if (onToggleRulers) {
            onToggleRulers();
            return;
          }
        }
      }

      // Regular keys

      // Escape: Deselect or Cancel
      if (e.key === 'Escape') {
        if (onEscape) {
          onEscape();
          return;
        } else if (activeObject) {
          canvas.discardActiveObject();
          canvas.requestRenderAll();
          return;
        }
      }

      // Delete or Backspace: Delete selected objects
      if ((e.key === 'Delete' || e.key === 'Backspace') && activeObject) {
        e.preventDefault();
        if (onDelete) {
          onDelete();
          return;
        }
      }

      // Arrow keys: Move objects
      if (
        ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key) &&
        activeObject
      ) {
        e.preventDefault();

        // Calculate movement step (larger step with shift key)
        const step = shiftKey ? keyboardMovementStep * 10 : keyboardMovementStep;

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
    },
    [
      canvas,
      enabled,
      skipOnInput,
      keyboardMovementStep,
      onDuplicate,
      onDelete,
      onGroup,
      onUngroup,
      onLockToggle,
      onBringForward,
      onSendBackward,
      onBringToFront,
      onSendToBack,
      onUndo,
      onRedo,
      onSave,
      onSelectAll,
      onCopy,
      onPaste,
      onCut,
      onEscape,
      onZoomIn,
      onZoomOut,
      onZoomReset,
      onToggleGrid,
      onToggleRulers,
      customShortcuts
    ]
  );

  // Register the keyboard event handler
  useEffect(() => {
    if (enabled) {
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [enabled, handleKeyDown]);

  // List of available keyboard shortcuts
  const getShortcutsList = () => {
    const shortcuts = [
      { key: 'Ctrl+D', description: 'Duplicate selected object' },
      { key: 'Ctrl+G', description: 'Group selected objects' },
      { key: 'Ctrl+Shift+G', description: 'Ungroup selected group' },
      { key: 'Ctrl+L', description: 'Toggle lock for selected object' },
      { key: 'Ctrl+]', description: 'Bring object forward' },
      { key: 'Ctrl+[', description: 'Send object backward' },
      { key: 'Ctrl+Shift+]', description: 'Bring object to front' },
      { key: 'Ctrl+Shift+[', description: 'Send object to back' },
      { key: 'Ctrl+Z', description: 'Undo' },
      { key: 'Ctrl+Y', description: 'Redo' },
      { key: 'Ctrl+S', description: 'Save' },
      { key: 'Ctrl+A', description: 'Select all objects' },
      { key: 'Delete/Backspace', description: 'Delete selected object' },
      { key: 'Arrow keys', description: 'Move selected object' },
      { key: 'Shift+Arrow keys', description: 'Move selected object by larger increment' },
      { key: 'Ctrl++', description: 'Zoom in' },
      { key: 'Ctrl+-', description: 'Zoom out' },
      { key: 'Ctrl+0', description: 'Reset zoom' },
      { key: 'Alt+G', description: 'Toggle grid' },
      { key: 'Alt+R', description: 'Toggle rulers' },
      { key: 'Escape', description: 'Deselect all / Cancel current operation' }
    ];

    // Add custom shortcuts
    customShortcuts.forEach((shortcut) => {
      let keyCombo = '';
      if (shortcut.ctrl) keyCombo += 'Ctrl+';
      if (shortcut.alt) keyCombo += 'Alt+';
      if (shortcut.shift) keyCombo += 'Shift+';
      keyCombo += shortcut.key;

      shortcuts.push({
        key: keyCombo,
        description: shortcut.description
      });
    });

    return shortcuts;
  };

  // Show keyboard shortcuts in a toast
  const showShortcutsToast = () => {
    const shortcuts = getShortcutsList()
      .map((s) => `${s.key}: ${s.description}`)
      .join('\n');

    toast({
      title: 'Keyboard Shortcuts',
      description: (
        <pre className="text-xs max-h-[200px] overflow-y-auto">
          {shortcuts}
        </pre>
      ),
      duration: 10000
    });
  };

  return {
    shortcuts: getShortcutsList(),
    showShortcutsToast
  };
}
