
import React, { useState } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  ListOrdered, 
  List, 
  Link, 
  Image
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Type your content here...",
  className,
  minHeight = "200px"
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const execCommand = (command: string, arg?: string) => {
    document.execCommand(command, false, arg);
    
    // Get the updated content from the editable div
    const editableDiv = document.getElementById('rich-text-editor');
    if (editableDiv) {
      onChange(editableDiv.innerHTML);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  return (
    <div className={cn("rich-text-editor border rounded-md", className, {
      "ring-2 ring-ring ring-offset-2": isFocused
    })}>
      <div className="toolbar bg-muted p-2 rounded-t-md flex flex-wrap gap-1 items-center">
        <Toggle size="sm" aria-label="Bold" onPressedChange={() => execCommand('bold')}>
          <Bold className="h-4 w-4" />
        </Toggle>
        <Toggle size="sm" aria-label="Italic" onPressedChange={() => execCommand('italic')}>
          <Italic className="h-4 w-4" />
        </Toggle>
        <Toggle size="sm" aria-label="Underline" onPressedChange={() => execCommand('underline')}>
          <Underline className="h-4 w-4" />
        </Toggle>

        <Separator orientation="vertical" className="h-6 mx-1" />
        
        <Toggle size="sm" aria-label="Align left" onPressedChange={() => execCommand('justifyLeft')}>
          <AlignLeft className="h-4 w-4" />
        </Toggle>
        <Toggle size="sm" aria-label="Align center" onPressedChange={() => execCommand('justifyCenter')}>
          <AlignCenter className="h-4 w-4" />
        </Toggle>
        <Toggle size="sm" aria-label="Align right" onPressedChange={() => execCommand('justifyRight')}>
          <AlignRight className="h-4 w-4" />
        </Toggle>

        <Separator orientation="vertical" className="h-6 mx-1" />
        
        <Toggle size="sm" aria-label="Ordered list" onPressedChange={() => execCommand('insertOrderedList')}>
          <ListOrdered className="h-4 w-4" />
        </Toggle>
        <Toggle size="sm" aria-label="Bullet list" onPressedChange={() => execCommand('insertUnorderedList')}>
          <List className="h-4 w-4" />
        </Toggle>

        <Separator orientation="vertical" className="h-6 mx-1" />
        
        <Button 
          size="sm" 
          variant="ghost" 
          onClick={() => {
            const url = prompt('Enter link URL');
            if (url) execCommand('createLink', url);
          }}
          className="h-8 w-8 p-0"
          title="Insert link"
        >
          <Link className="h-4 w-4" />
        </Button>
        <Button 
          size="sm" 
          variant="ghost" 
          onClick={() => {
            const url = prompt('Enter image URL');
            if (url) execCommand('insertImage', url);
          }}
          className="h-8 w-8 p-0"
          title="Insert image"
        >
          <Image className="h-4 w-4" />
        </Button>
      </div>
      
      <div
        id="rich-text-editor"
        contentEditable
        dangerouslySetInnerHTML={{ __html: value }}
        onInput={(e) => onChange((e.target as HTMLDivElement).innerHTML)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onPaste={handlePaste}
        className={cn(
          "p-3 outline-none overflow-auto",
          isFocused ? "bg-background" : "bg-background"
        )}
        style={{ minHeight }}
        placeholder={placeholder}
      />
    </div>
  );
};

export default RichTextEditor;
