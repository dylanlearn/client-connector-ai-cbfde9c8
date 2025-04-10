
import React from 'react';
import { Textarea } from '@/components/ui/textarea';

interface RichTextEditorProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  minHeight?: string;
  placeholder?: string;
}

// A simple textarea component to serve as a placeholder for a rich text editor
// In a real implementation, this would be replaced with a proper rich text editor
const RichTextEditor: React.FC<RichTextEditorProps> = ({ 
  id, 
  value, 
  onChange, 
  minHeight = '100px',
  placeholder
}) => {
  return (
    <Textarea
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{ minHeight }}
      className="w-full font-sans text-base p-2"
    />
  );
};

export default RichTextEditor;
