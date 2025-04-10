
import React from 'react';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import GenericSectionEditor from './GenericSectionEditor';

interface ContactSectionEditorProps {
  section: WireframeSection;
  onUpdate: (updates: Partial<WireframeSection>) => void;
}

const ContactSectionEditor: React.FC<ContactSectionEditorProps> = ({ section, onUpdate }) => {
  return <GenericSectionEditor section={section} onUpdate={onUpdate} title="Contact" />;
};

export default ContactSectionEditor;
