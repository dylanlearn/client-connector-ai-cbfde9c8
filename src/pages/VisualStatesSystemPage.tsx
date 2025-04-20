
import React from 'react';
import { VisualStateProvider } from '@/contexts/VisualStateContext';
import { VisualStateShowcase } from '@/components/visual-states/VisualStateShowcase';

export default function VisualStatesSystemPage() {
  return (
    <VisualStateProvider>
      <VisualStateShowcase />
    </VisualStateProvider>
  );
}
