
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import WireframeExportDialog from '../WireframeExportDialog';

describe('WireframeExportDialog', () => {
  it('renders the dialog with export options', () => {
    render(
      <WireframeExportDialog 
        wireframe={{ 
          id: 'test-wireframe',
          title: 'Test Wireframe',
          sections: []
        }}
        isOpen={true}
        onClose={() => {}}
      />
    );
    
    // Check if the dialog title is rendered
    expect(screen.getByText('Export Wireframe')).toBeInTheDocument();
    
    // Check if export buttons are rendered
    expect(screen.getByText('Export as HTML')).toBeInTheDocument();
    expect(screen.getByText('Export as PDF')).toBeInTheDocument();
    expect(screen.getByText('Export as Image')).toBeInTheDocument();
  });

  // Test compatibility props
  it('works with compatibility props (open/onOpenChange)', () => {
    const mockOnOpenChange = vi.fn();
    
    render(
      <WireframeExportDialog 
        wireframe={{ 
          id: 'test-wireframe',
          title: 'Test Wireframe',
          sections: []
        }}
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    );
    
    // Check if the dialog title is rendered
    expect(screen.getByText('Export Wireframe')).toBeInTheDocument();
  });
});
