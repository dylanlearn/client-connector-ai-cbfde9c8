
import React from "react";
import { DesignOption } from "@/components/design/preview/types";
import { Card, CardContent } from "@/components/ui/card";

interface InteractionPreviewProps {
  interaction: DesignOption;
}

const InteractionPreview: React.FC<InteractionPreviewProps> = ({ interaction }) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-2">{interaction.name}</h3>
        <p className="text-sm text-muted-foreground">{interaction.description}</p>
        
        {interaction.preview && (
          <div className="mt-4 p-3 bg-muted rounded-md">
            <div 
              className="interactive-preview" 
              dangerouslySetInnerHTML={{ __html: interaction.preview }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InteractionPreview;
