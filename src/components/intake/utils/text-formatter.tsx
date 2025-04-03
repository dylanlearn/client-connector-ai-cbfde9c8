
import { Circle } from "lucide-react";
import React from "react";

/**
 * Formats text with proper styling, converting markdown-like syntax to JSX
 */
export const formatText = (text: string) => {
  // Replace markdown headers with styled headers
  const processedText = text
    .replace(/^###\s+(.+)$/gm, '<span class="text-lg font-bold mb-2 mt-4 block">$1</span>')
    .replace(/^##\s+(.+)$/gm, '<span class="text-xl font-bold mb-3 mt-5 block">$1</span>')
    .replace(/^#\s+(.+)$/gm, '<span class="text-2xl font-bold mb-4 mt-6 block">$1</span>');
    
  // Split by paragraphs and process
  const paragraphs = processedText.split('\n\n');
  
  return paragraphs.map((paragraph, idx) => {
    // Skip empty paragraphs
    if (paragraph.trim() === '') return null;
    
    // If paragraph starts with a bullet marker (or we should convert it to one)
    if (paragraph.trim().startsWith('- ') || paragraph.trim().startsWith('* ')) {
      return (
        <div key={idx} className="flex items-start mb-3 gap-2">
          <Circle className="h-2 w-2 mt-2 text-yellow-400 flex-shrink-0" />
          <div 
            dangerouslySetInnerHTML={{ 
              __html: paragraph.replace(/^[*-]\s+/, '')
            }} 
            className="text-zinc-300 leading-relaxed"
          />
        </div>
      );
    }
    
    // Regular paragraph with potential formatted headers
    return (
      <div 
        key={idx} 
        dangerouslySetInnerHTML={{ __html: paragraph }} 
        className="mb-4 text-zinc-300 leading-relaxed"
      />
    );
  });
};
