
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import WireframeExportDialog from '../WireframeExportDialog';
import { renderWithProviders } from '@/test/helpers/component-test-helpers';

describe('WireframeExportDialog', () => {
  it('renders export dialog correctly', () => {
    const mockWireframe = {
      id: 'test-id',
      title: 'Test Wireframe',
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
    
    const onCloseMock = vi.fn();

    renderWithProviders(
      <WireframeExportDialog 
        wireframe={mockWireframe} 
        open={true} 
        onClose={onCloseMock}
      />
    );

    expect(screen.getByText(/Export Wireframe/i)).toBeInTheDocument();
    // Additional assertions would go here
  });

  it('closes dialog when cancel is clicked', () => {
    const mockWireframe = {
      id: 'test-id',
      title: 'Test Wireframe',
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
    
    const onCloseMock = vi.fn();

    renderWithProviders(
      <WireframeExportDialog 
        wireframe={mockWireframe} 
        open={true} 
        onClose={onCloseMock}
      />
    );

    // Find and click the cancel button
    const cancelButton = screen.getByText(/Cancel/i);
    fireEvent.click(cancelButton);

    expect(onCloseMock).toHaveBeenCalled();
  });
});
