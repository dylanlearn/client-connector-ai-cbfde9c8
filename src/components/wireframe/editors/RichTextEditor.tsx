
import React, { useState, useRef, useEffect, FormEvent, ClipboardEvent } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  minHeight?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  minHeight = "150px"
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isEmpty, setIsEmpty] = useState(!value || value === '');
  const editorRef = useRef<HTMLDivElement>(null);
  const ignoreNextInputRef = useRef(false);
  
  // Set initial content and handle content updates from parent
  useEffect(() => {
    if (editorRef.current && !isFocused) {
      // Only update the content if it's different to prevent cursor jumps
      if (editorRef.current.innerHTML !== value) {
        // Set the flag to ignore the next input event
        ignoreNextInputRef.current = true;
        editorRef.current.innerHTML = value;
      }
    }
  }, [value, isFocused]);
  
  // Handle input changes with debouncing to prevent freezing
  const handleInput = (e: FormEvent<HTMLDivElement>) => {
    // Skip if this input event was triggered by our own content update
    if (ignoreNextInputRef.current) {
      ignoreNextInputRef.current = false;
      return;
    }
    
    const content = e.currentTarget.innerHTML;
    setIsEmpty(!content || content === '<br>' || content === '');
    
    // Update the parent component with the new value
    onChange(content);
  };
  
  // Handle focus
  const handleFocus = () => {
    setIsFocused(true);
  };
  
  // Handle blur
  const handleBlur = () => {
    setIsFocused(false);
  };
  
  // Handle paste to strip formatting
  const handlePaste = (e: ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    // Get plain text from clipboard
    const text = e.clipboardData.getData('text/plain');
    
    // Insert at cursor position using the execCommand API
    document.execCommand('insertText', false, text);
    
    // Update value (the execCommand will trigger the input event)
    if (editorRef.current) {
      setIsEmpty(!editorRef.current.textContent);
    }
  };
  
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
};

export default RichTextEditor;
