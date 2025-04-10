
import React from 'react';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import GenericSectionEditor from './GenericSectionEditor';

interface BlogSectionEditorProps {
  section: WireframeSection;
  onUpdate: (updates: Partial<WireframeSection>) => void;
}

const BlogSectionEditor: React.FC<BlogSectionEditorProps> = ({ section, onUpdate }) => {
  return <GenericSectionEditor section={section} onUpdate={onUpdate} title="Blog" />;
};

export default BlogSectionEditor;
