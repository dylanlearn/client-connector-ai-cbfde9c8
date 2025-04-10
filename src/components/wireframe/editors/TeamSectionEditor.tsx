
import React from 'react';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import GenericSectionEditor from './GenericSectionEditor';

interface TeamSectionEditorProps {
  section: WireframeSection;
  onUpdate: (updates: Partial<WireframeSection>) => void;
}

const TeamSectionEditor: React.FC<TeamSectionEditorProps> = ({ section, onUpdate }) => {
  return <GenericSectionEditor section={section} onUpdate={onUpdate} title="Team" />;
};

export default TeamSectionEditor;
