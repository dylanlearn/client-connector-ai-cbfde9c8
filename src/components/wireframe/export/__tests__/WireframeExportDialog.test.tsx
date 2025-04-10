
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import WireframeExportDialog from '../WireframeExportDialog';

describe('WireframeExportDialog', () => {
  it('renders the dialog with export options', () => {
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
    
    // Check if export format options are rendered
    expect(screen.getByText('PDF')).toBeInTheDocument();
    expect(screen.getByText('PNG')).toBeInTheDocument();
    expect(screen.getByText('HTML')).toBeInTheDocument();
  });
});
