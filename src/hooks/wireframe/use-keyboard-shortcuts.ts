
import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface ShortcutAction {
  name: string;
  keys: string[];
  description: string;
  action: () => void;
  category?: string;
}

export interface KeyboardShortcutsConfig {
  enabled?: boolean;
  preventDefaultForKeys?: boolean;
  useHelpModal?: boolean;
  showToasts?: boolean;
}

const DEFAULT_CONFIG: KeyboardShortcutsConfig = {
  enabled: true,
  preventDefaultForKeys: true,
  useHelpModal: true,
  showToasts: true
};

export function useKeyboardShortcuts(config: KeyboardShortcutsConfig = DEFAULT_CONFIG) {
  const [shortcuts, setShortcuts] = useState<Record<string, ShortcutAction>>({});
  const keysDown = useRef<Set<string>>(new Set());
  const [shortcutConfig, setShortcutConfig] = useState<KeyboardShortcutsConfig>({
    ...DEFAULT_CONFIG,
    ...config
  });
  const { toast } = useToast();

  // Register a shortcut
  const registerShortcut = useCallback((shortcut: ShortcutAction) => {
    setShortcuts(prev => ({
      ...prev,
      [shortcut.name]: shortcut
    }));
  }, []);

  // Unregister a shortcut
  const unregisterShortcut = useCallback((name: string) => {
    setShortcuts(prev => {
      const updated = { ...prev };
      delete updated[name];
      return updated;
    });
  }, []);

  // Check if a key is pressed
  const isKeyPressed = useCallback((key: string) => {
    return keysDown.current.has(key.toLowerCase());
  }, []);

  // Check if all keys in an array are pressed
  const areKeysPressed = useCallback((keys: string[]) => {
    return keys.every(key => keysDown.current.has(key.toLowerCase()));
  }, []);

  // Show toast with shortcuts help
  const showShortcutsToast = useCallback(() => {
    if (!shortcutConfig.showToasts) return;
    
    const categories: Record<string, ShortcutAction[]> = {};
    
    Object.values(shortcuts).forEach(shortcut => {
      const category = shortcut.category || 'General';
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(shortcut);
    });
    
    // Create structured message content for the toast
    // We're using a string description instead of JSX
    const formatShortcuts = () => {
      return Object.entries(categories).map(([category, categoryShortcuts]) => {
        return `
          <div key="${category}" class="mb-2">
            <h4 class="font-semibold text-sm">${category}</h4>
            <ul class="text-sm">
              ${categoryShortcuts.map(shortcut => `
                <li key="${shortcut.name}" class="flex justify-between">
                  <span>${shortcut.description}</span>
                  <span class="font-mono bg-muted px-1 rounded ml-2">
                    ${shortcut.keys.join('+')}
                  </span>
                </li>
              `).join('')}
            </ul>
          </div>
        `;
      }).join('');
    };
    
    // Format HTML string for the toast description
    const htmlContent = `
      <div class="shortcuts-toast">
        <h3 class="font-bold mb-2">Keyboard Shortcuts</h3>
        ${formatShortcuts()}
      </div>
    `;
    
    toast({
      title: "Keyboard Shortcuts",
      description: htmlContent,
      duration: 8000,
    });
  }, [shortcuts, shortcutConfig.showToasts, toast]);

  // Show shortcuts help
  const showShortcutsHelp = useCallback(() => {
    if (shortcutConfig.useHelpModal) {
      // Logic for showing a modal would go here
      console.log('Show shortcuts modal');
    } else {
      // Show a toast with shortcuts
      showShortcutsToast();
    }
  }, [shortcutConfig.useHelpModal, showShortcutsToast]);

  // Update configuration
  const configure = useCallback((newConfig: KeyboardShortcutsConfig) => {
    setShortcutConfig(prev => ({
      ...prev,
      ...newConfig
    }));
  }, []);

  // Event handlers for keyboard events
  useEffect(() => {
    if (!shortcutConfig.enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if we're in an input field
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      const key = e.key.toLowerCase();
      keysDown.current.add(key);

      // Check for matching shortcuts
      Object.values(shortcuts).forEach(shortcut => {
        if (areKeysPressed(shortcut.keys.map(k => k.toLowerCase()))) {
          if (shortcutConfig.preventDefaultForKeys) {
            e.preventDefault();
          }
          shortcut.action();
        }
      });
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      keysDown.current.delete(key);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [shortcuts, shortcutConfig, areKeysPressed]);

  // Register common shortcuts
  useEffect(() => {
    // Register help shortcut (question mark)
    registerShortcut({
      name: 'showShortcutsHelp',
      keys: ['shift', '?'],
      description: 'Show keyboard shortcuts',
      action: showShortcutsHelp,
      category: 'Help'
    });

    // Clean up shortcut on unmount
    return () => {
      unregisterShortcut('showShortcutsHelp');
    };
  }, [registerShortcut, showShortcutsHelp, unregisterShortcut]);

  return {
    registerShortcut,
    unregisterShortcut,
    isKeyPressed,
    areKeysPressed,
    showShortcutsHelp,
    showShortcutsToast,
    configure,
    keysDown: keysDown.current
  };
}
