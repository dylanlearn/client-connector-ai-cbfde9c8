
import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import WireframeExportDialog from '../WireframeExportDialog';
import { screen, fireEvent } from '../../../../test/setup';
import { renderWithProviders } from '@/test/helpers/component-test-helpers';

describe('WireframeExportDialog', () => {
  it('renders export dialog correctly', () => {
    const mockWireframe = {
      id: 'test-id',
      title: 'Test Wireframe',
      description: 'A test wireframe for unit testing',
      sections: [],
      colorScheme: {
        primary: '#3b82f6',
        secondary: '#10b981',
        accent: '#f59e0b',
        background: '#ffffff',
        text: '#000000'
      },
      typography: {
        headings: 'Inter',
        body: 'Inter'
      }
    };
    
    const onOpenChangeMock = vi.fn();

    renderWithProviders(
      <WireframeExportDialog 
        wireframe={mockWireframe} 
        open={true} 
        onOpenChange={onOpenChangeMock}
      />
    );

    expect(screen.getByText(/Export Wireframe/i)).toBeInTheDocument();
    // Additional assertions would go here
  });

  it('closes dialog when cancel is clicked', () => {
    const mockWireframe = {
      id: 'test-id',
      title: 'Test Wireframe',
      description: 'A test wireframe for unit testing',
      sections: [],
      colorScheme: {
        primary: '#3b82f6',
        secondary: '#10b981',
        accent: '#f59e0b',
        background: '#ffffff',
        text: '#000000'
      },
      typography: {
        headings: 'Inter',
        body: 'Inter'
      }
    };
    
    const onOpenChangeMock = vi.fn();

    renderWithProviders(
      <WireframeExportDialog 
        wireframe={mockWireframe} 
        open={true} 
        onOpenChange={onOpenChangeMock}
      />
    );

    // Find and click the cancel button
    const cancelButton = screen.getByText(/Cancel/i);
    fireEvent.click(cancelButton);

    expect(onOpenChangeMock).toHaveBeenCalledWith(false);
  });
});
