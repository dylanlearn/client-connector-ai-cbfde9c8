
import React from 'react';
import { DesignOption } from '../preview/types';

interface InteractionPreviewProps {
  interaction: DesignOption;
}

const InteractionPreview: React.FC<InteractionPreviewProps> = ({ interaction }) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-md">
      <h3 className="text-lg font-medium mb-3">{interaction.title}</h3>
      <div className="bg-gray-100 rounded-md p-4 h-40 mb-4 flex items-center justify-center text-gray-500">
        {interaction.imageUrl ? (
          <img 
            src={interaction.imageUrl} 
            alt={interaction.title} 
            className="max-h-full object-contain"
          />
        ) : (
          <p>Interaction preview</p>
        )}
      </div>
      <p className="text-sm text-gray-600">{interaction.description}</p>
    </div>
  );
};

export default InteractionPreview;
