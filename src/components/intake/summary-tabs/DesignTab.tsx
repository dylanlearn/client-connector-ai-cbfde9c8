
import React from "react";
import { CardContent } from "@/components/ui/card";
import { Palette, Type } from "lucide-react";

interface DesignTabProps {
  tone: string[];
}

const DesignTab = ({ tone }: DesignTabProps) => {
  return (
    <CardContent>
      <div className="space-y-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Palette className="h-5 w-5 text-yellow-400" />
            <h3 className="text-lg font-semibold">Color Scheme</h3>
          </div>
          
          <ul className="space-y-6 pl-5">
            <li className="list-disc list-outside">
              <div>
                <p className="font-medium">Primary Color:</p>
                <div className="flex items-center gap-2 mt-1 mb-1">
                  <div className="w-4 h-4 rounded-full bg-indigo-600"></div>
                  <span className="text-zinc-300">{tone[0] === 'professional' ? 'Deep Navy Blue' : 'Charcoal Gray'}</span>
                </div>
                <div className="border-l-2 border-zinc-700 pl-4 ml-1 mt-2">
                  <p className="text-zinc-400 italic">
                    Represents professionalism, reliability, and strength. Forms a strong backdrop for accents.
                  </p>
                </div>
              </div>
            </li>
            
            <li className="list-disc list-outside">
              <div>
                <p className="font-medium">Accent Color:</p>
                <div className="flex items-center gap-2 mt-1 mb-1">
                  <div className="w-4 h-4 rounded-full bg-yellow-400"></div>
                  <span className="text-zinc-300">Bright {tone.includes('bold') ? 'Electric Orange' : 'Yellow'}</span>
                </div>
                <div className="border-l-2 border-zinc-700 pl-4 ml-1 mt-2">
                  <p className="text-zinc-400 italic">
                    Used for buttons, highlights, and CTAs. Adds energy and visibility against the dark base.
                  </p>
                </div>
              </div>
            </li>
            
            <li className="list-disc list-outside">
              <div>
                <p className="font-medium">Text Color:</p>
                <div className="flex items-center gap-2 mt-1 mb-1">
                  <div className="w-4 h-4 rounded-full bg-gray-200"></div>
                  <span className="text-zinc-300">Light Gray or White</span>
                </div>
                <div className="border-l-2 border-zinc-700 pl-4 ml-1 mt-2">
                  <p className="text-zinc-400 italic">
                    Ensures excellent readability while maintaining a sleek, modern look.
                  </p>
                </div>
              </div>
            </li>
          </ul>
        </div>
        
        <div className="border-t border-zinc-800 pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Type className="h-5 w-5 text-yellow-400" />
            <h3 className="text-lg font-semibold">Font Choices</h3>
          </div>
          
          <ul className="space-y-6 pl-5">
            <li className="list-disc list-outside">
              <div>
                <p className="font-medium">Headings:</p>
                <p className="text-zinc-300 mt-1 mb-1">Use Montserrat or Poppins</p>
                <div className="border-l-2 border-zinc-700 pl-4 ml-1 mt-2">
                  <p className="text-zinc-400 italic">
                    Bold, sans-serif fonts for strong visual hierarchy and a clean modern edge.
                  </p>
                </div>
              </div>
            </li>
            
            <li className="list-disc list-outside">
              <div>
                <p className="font-medium">Body Text:</p>
                <p className="text-zinc-300 mt-1 mb-1">Use Open Sans or Roboto</p>
                <div className="border-l-2 border-zinc-700 pl-4 ml-1 mt-2">
                  <p className="text-zinc-400 italic">
                    Clean and easy to read, enhancing accessibility and professionalism.
                  </p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </CardContent>
  );
};

export default DesignTab;
