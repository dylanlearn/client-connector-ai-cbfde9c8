
import React from "react";
import { CardContent } from "@/components/ui/card";
import { LayoutPanelTop } from "lucide-react";

interface ContentTabProps {
  draftCopy: {
    header: string;
    subtext: string;
    cta: string;
  };
}

const ContentTab = ({ draftCopy }: ContentTabProps) => {
  return (
    <CardContent>
      <div className="space-y-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <LayoutPanelTop className="h-5 w-5 text-yellow-400" />
            <h3 className="text-lg font-semibold">Layout & Design Elements</h3>
          </div>
          
          <div className="mt-4 space-y-6">
            <div>
              <p className="text-lg font-medium mb-2">1. Hero Section</p>
              <ul className="space-y-3 pl-5">
                <li className="list-disc list-outside">
                  <p className="text-zinc-300">Full-width background image showcasing your work.</p>
                </li>
                <li className="list-disc list-outside">
                  <p className="text-zinc-300">Dark-to-transparent gradient overlay to improve text visibility.</p>
                </li>
                <li className="list-disc list-outside">
                  <div>
                    <p className="text-zinc-300">Bold headline:</p>
                    <div className="border-l-2 border-zinc-700 pl-4 ml-1 mt-2">
                      <p className="text-zinc-400 italic">Example: "{draftCopy.header}"</p>
                    </div>
                  </div>
                </li>
                <li className="list-disc list-outside">
                  <div>
                    <p className="text-zinc-300">CTA Button in the accent color:</p>
                    <div className="border-l-2 border-zinc-700 pl-4 ml-1 mt-2">
                      <p className="text-zinc-400 italic">Example: "{draftCopy.cta}"</p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            
            <div>
              <p className="text-lg font-medium mb-2">2. Supporting Content</p>
              <div className="pl-5">
                <div className="border-l-2 border-zinc-700 pl-4 mt-2">
                  <p className="text-zinc-400">
                    {draftCopy.subtext}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  );
};

export default ContentTab;
