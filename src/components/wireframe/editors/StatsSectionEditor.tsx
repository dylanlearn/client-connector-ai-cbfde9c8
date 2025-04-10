
import React from 'react';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import GenericSectionEditor from './GenericSectionEditor';

interface StatsSectionEditorProps {
  section: WireframeSection;
  onUpdate: (updates: Partial<WireframeSection>) => void;
}

const StatsSectionEditor: React.FC<StatsSectionEditorProps> = ({ section, onUpdate }) => {
  return <GenericSectionEditor section={section} onUpdate={onUpdate} title="Stats" />;
};

export default StatsSectionEditor;
