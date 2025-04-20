
import React from 'react';
import { ResponsiveShowcase } from '@/components/wireframe/responsive/ResponsiveShowcase';
import { ResponsiveProvider } from '@/contexts/ResponsiveContext';

export default function ResponsiveSystemPage() {
  return (
    <ResponsiveProvider>
      <ResponsiveShowcase />
    </ResponsiveProvider>
  );
}
