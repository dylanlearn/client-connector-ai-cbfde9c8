
import React, { useState, useRef, useEffect, FormEvent, ClipboardEvent, useCallback, memo } from 'react';
import { debounce } from 'lodash';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  minHeight?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = memo(({
  value,
  onChange,
  minHeight = "150px"
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isEmpty, setIsEmpty] = useState(!value || value === '');
  const editorRef = useRef<HTMLDivElement>(null);
  const ignoreNextInputRef = useRef(false);
  const previousValueRef = useRef(value);
  
  // Debounce the onChange handler to prevent excessive updates
  const debouncedOnChange = useCallback(
    debounce((content: string) => {
      // Only update if the content actually changed
      if (content !== previousValueRef.current) {
        previousValueRef.current = content;
        onChange(content);
      }
    }, 250),
    [onChange]
  );
  
  // Set initial content and handle content updates from parent
  useEffect(() => {
    if (editorRef.current && !isFocused) {
      // Only update the content if it's different to prevent cursor jumps
      if (editorRef.current.innerHTML !== value) {
        // Set the flag to ignore the next input event
        ignoreNextInputRef.current = true;
        editorRef.current.innerHTML = value;
        previousValueRef.current = value;
      }
    }
  }, [value, isFocused]);
  
  // Handle input changes with debouncing to prevent freezing
  const handleInput = useCallback((e: FormEvent<HTMLDivElement>) => {
    // Skip if this input event was triggered by our own content update
    if (ignoreNextInputRef.current) {
      ignoreNextInputRef.current = false;
      return;
    }
    
    const content = e.currentTarget.innerHTML;
    setIsEmpty(!content || content === '<br>' || content === '');
    
    // Update with debounced handler
    debouncedOnChange(content);
  }, [debouncedOnChange]);
  
  // Handle focus
  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);
  
  // Handle blur
  const handleBlur = useCallback(() => {
    setIsFocused(false);
    
    // Ensure we have the final value on blur
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      if (content !== previousValueRef.current) {
        previousValueRef.current = content;
        onChange(content);
      }
    }
  }, [onChange]);
  
  // Handle paste to strip formatting
  const handlePaste = useCallback((e: ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    // Get plain text from clipboard
    const text = e.clipboardData.getData('text/plain');
    
    // Insert at cursor position using the execCommand API
    document.execCommand('insertText', false, text);
    
    // Update value (the execCommand will trigger the input event)
    if (editorRef.current) {
      setIsEmpty(!editorRef.current.textContent);
      debouncedOnChange(editorRef.current.innerHTML);
    }
  }, [debouncedOnChange]);
  
  return (
    <div 
      className="relative border rounded-md shadow-sm transition-all overflow-hidden"
    >
      <div
        className={`editor-container ${isFocused ? 'ring-2 ring-primary/50' : ''}`}
      >
        {isEmpty && !isFocused && (
          <div 
            className="absolute top-2 left-3 text-muted-foreground pointer-events-none"
          >
            Enter content here...
          </div>
        )}
        <div
          ref={editorRef}
          contentEditable={true}
          onInput={handleInput}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onPaste={handlePaste}
          className="p-3 outline-none w-full"
          style={{ minHeight }}
        />
      </div>
    </div>
  );
});

RichTextEditor.displayName = 'RichTextEditor';

export default RichTextEditor;
