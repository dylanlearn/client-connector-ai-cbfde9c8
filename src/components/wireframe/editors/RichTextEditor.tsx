
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
  
  useEffect(() => {
    if (editorRef.current) {
      // Set initial content
      editorRef.current.innerHTML = value;
    }
  }, []);
  
  // Handle input changes
  const handleInput = (e: FormEvent<HTMLDivElement>) => {
    const content = e.currentTarget.innerHTML;
    onChange(content);
    setIsEmpty(!content || content === '<br>' || content === '');
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
    
    // Insert at cursor position
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      
      const textNode = document.createTextNode(text);
      range.insertNode(textNode);
      
      // Move cursor to end
      range.setStartAfter(textNode);
      range.setEndAfter(textNode);
      selection.removeAllRanges();
      selection.addRange(range);
    }
    
    // Update value
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
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
          id={`rich-text-editor-${Math.random().toString(36).substring(2, 9)}`}
          contentEditable={true}
          dangerouslySetInnerHTML={{ __html: value }}
          onInput={handleInput}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onPaste={handlePaste}
          className="p-3 outline-none min-h-[150px] w-full"
          style={{ minHeight }}
        />
      </div>
    </div>
  );
};

export default RichTextEditor;
