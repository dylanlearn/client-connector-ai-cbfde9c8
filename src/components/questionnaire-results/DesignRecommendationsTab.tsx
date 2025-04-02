
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileImage, Layout, Palette, Type } from "lucide-react";
import { styleRecommendations, componentSuggestions } from "./data/projectData";

const DesignRecommendationsTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Design Recommendations</CardTitle>
        <CardDescription>
          Based on the client's answers, our AI has generated the following design recommendations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <Palette className="mr-2 h-5 w-5" />
              Color Palette
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {styleRecommendations.colors.map((color, index) => (
                <div key={index} className="border rounded-lg overflow-hidden">
                  <div className={`h-16 ${color.swatch}`}></div>
                  <div className="p-3">
                    <p className="font-medium">{color.name}</p>
                    <p className="text-sm text-gray-500">{color.hex}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <Type className="mr-2 h-5 w-5" />
              Typography
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-2">Headings</p>
                <p className="text-xl font-bold" style={{ fontFamily: "Montserrat, sans-serif" }}>
                  {styleRecommendations.typography.headings}
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-2">Body</p>
                <p className="text-base" style={{ fontFamily: "Open Sans, sans-serif" }}>
                  {styleRecommendations.typography.body}
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-2">Accents</p>
                <p className="text-base font-medium" style={{ fontFamily: "Montserrat, sans-serif" }}>
                  {styleRecommendations.typography.accents}
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <Layout className="mr-2 h-5 w-5" />
              Layout Recommendations
            </h3>
            <ul className="space-y-2 border rounded-lg p-4">
              {styleRecommendations.layouts.map((layout, index) => (
                <li key={index} className="flex items-start">
                  <div className="bg-indigo-100 text-indigo-600 rounded-full p-1 mr-2 mt-0.5">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>{layout}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <FileImage className="mr-2 h-5 w-5" />
              Component Suggestions
            </h3>
            <div className="space-y-4">
              {componentSuggestions.map((component, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h4 className="font-medium">{component.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{component.description}</p>
                  <p className="text-xs text-gray-500 italic">Inspiration: {component.inspiration}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DesignRecommendationsTab;
