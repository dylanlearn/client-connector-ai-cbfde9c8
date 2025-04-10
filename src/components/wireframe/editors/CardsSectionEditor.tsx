
import React from 'react';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import GenericSectionEditor from './GenericSectionEditor';

interface CardsSectionEditorProps {
  section: WireframeSection;
  onUpdate: (updates: Partial<WireframeSection>) => void;
}

const CardsSectionEditor: React.FC<CardsSectionEditorProps> = ({ section, onUpdate }) => {
  return <GenericSectionEditor section={section} onUpdate={onUpdate} title="Cards" />;
};

export default CardsSectionEditor;
