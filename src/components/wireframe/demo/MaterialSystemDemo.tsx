
import React from 'react';
import { FidelityProvider } from '../fidelity/FidelityContext';
import MaterialsDemo from '../materials/MaterialsDemo';
import '../materials/materials.css';

const MaterialSystemDemo: React.FC = () => {
  return (
    <FidelityProvider initialLevel="medium" transitionDuration={300}>
      <MaterialsDemo />
    </FidelityProvider>
  );
};

export default MaterialSystemDemo;
