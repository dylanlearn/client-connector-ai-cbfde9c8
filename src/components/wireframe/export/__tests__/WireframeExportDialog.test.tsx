
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import WireframeExportDialog from '../WireframeExportDialog';
import { exportWireframe } from '@/utils/wireframe/export-utils';
import { toast } from 'sonner';
import { WireframeData, WireframeSection } from '@/services/ai/wireframe/wireframe-types';

// Mock dependencies
vi.mock('sonner', () => ({
  toast: vi.fn()
}));

vi.mock('@/utils/wireframe/export-utils', () => ({
  exportWireframe: vi.fn().mockResolvedValue(undefined),
  ExportError: class ExportError extends Error {
    constructor(message: string, public originalError?: Error) {
      super(message);
      this.name = 'ExportError';
    }
  }
}));

describe('WireframeExportDialog', () => {
  const mockWireframe: WireframeData = {
    id: 'test-id',
    title: 'Test Wireframe',
    description: 'Test description',
    sections: [
      {
        id: 'section-1',
        name: 'Section 1',
        sectionType: 'content',
        components: []
      }
    ]
  };

  const mockProps = {
    wireframe: mockWireframe,
    open: true,
    onOpenChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly with default options', () => {
    render(<WireframeExportDialog {...mockProps} />);
    
    expect(screen.getByText('Export Wireframe')).toBeInTheDocument();
    expect(screen.getByText('Choose your preferred export format and options.')).toBeInTheDocument();
    expect(screen.getByLabelText('File Name (optional)')).toBeInTheDocument();
    expect(screen.getByLabelText('HTML')).toBeInTheDocument();
    expect(screen.getByLabelText('JSON')).toBeInTheDocument();
    expect(screen.getByLabelText('PDF')).toBeInTheDocument();
    expect(screen.getByLabelText('PNG')).toBeInTheDocument();
    expect(screen.getByLabelText('SVG')).toBeInTheDocument();
    expect(screen.getByLabelText('Include Design System')).toBeChecked();
    expect(screen.getByLabelText('Include Components')).toBeChecked();
  });

  it('handles format selection', () => {
    render(<WireframeExportDialog {...mockProps} />);
    
    const pdfOption = screen.getByLabelText('PDF');
    fireEvent.click(pdfOption);
    
    expect(screen.getByText('Export as PDF')).toBeInTheDocument();
  });

  it('handles checkbox changes', () => {
    render(<WireframeExportDialog {...mockProps} />);
    
    const designSystemCheckbox = screen.getByLabelText('Include Design System');
    const componentsCheckbox = screen.getByLabelText('Include Components');
    
    fireEvent.click(designSystemCheckbox);
    fireEvent.click(componentsCheckbox);
    
    expect(designSystemCheckbox).not.toBeChecked();
    expect(componentsCheckbox).not.toBeChecked();
  });

  it('handles file name input', () => {
    render(<WireframeExportDialog {...mockProps} />);
    
    const fileNameInput = screen.getByLabelText('File Name (optional)');
    fireEvent.change(fileNameInput, { target: { value: 'my-wireframe' } });
    
    expect(fileNameInput).toHaveValue('my-wireframe');
  });

  it('exports wireframe with correct options', async () => {
    render(<WireframeExportDialog {...mockProps} />);
    
    // Change format to PDF
    const pdfOption = screen.getByLabelText('PDF');
    fireEvent.click(pdfOption);
    
    // Change file name
    const fileNameInput = screen.getByLabelText('File Name (optional)');
    fireEvent.change(fileNameInput, { target: { value: 'my-wireframe' } });
    
    // Uncheck include components
    const componentsCheckbox = screen.getByLabelText('Include Components');
    fireEvent.click(componentsCheckbox);
    
    // Click export button
    const exportButton = screen.getByText('Export as PDF');
    fireEvent.click(exportButton);
    
    await waitFor(() => {
      expect(exportWireframe).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'test-id',
          title: 'Test Wireframe',
          sections: expect.any(Array),
        }),
        'pdf',
        expect.objectContaining({
          fileName: 'my-wireframe'
        })
      );
    });
  });

  it('handles export errors gracefully', async () => {
    (exportWireframe as unknown as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('Export failed'));
    
    render(<WireframeExportDialog {...mockProps} />);
    
    const exportButton = screen.getByText('Export as HTML');
    fireEvent.click(exportButton);
    
    await waitFor(() => {
      expect(toast).toHaveBeenCalled();
    });
  });

  it('disables export when no wireframe is provided', () => {
    render(<WireframeExportDialog {...mockProps} wireframe={null} />);
    
    const exportButton = screen.getByText('Export as HTML');
    expect(exportButton).toBeDisabled();
  });

  it('shows loading state during export', async () => {
    // Make exportWireframe wait before resolving
    (exportWireframe as unknown as ReturnType<typeof vi.fn>).mockImplementationOnce(() => {
      return new Promise(resolve => setTimeout(resolve, 100));
    });
    
    render(<WireframeExportDialog {...mockProps} />);
    
    const exportButton = screen.getByText('Export as HTML');
    fireEvent.click(exportButton);
    
    expect(await screen.findByText('Exporting...')).toBeInTheDocument();
  });

  it('closes dialog after successful export', async () => {
    render(<WireframeExportDialog {...mockProps} />);
    
    const exportButton = screen.getByText('Export as HTML');
    fireEvent.click(exportButton);
    
    await waitFor(() => {
      expect(mockProps.onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  it('disables controls during export', async () => {
    // Make exportWireframe wait before resolving
    (exportWireframe as unknown as ReturnType<typeof vi.fn>).mockImplementationOnce(() => {
      return new Promise(resolve => setTimeout(resolve, 100));
    });
    
    render(<WireframeExportDialog {...mockProps} />);
    
    const exportButton = screen.getByText('Export as HTML');
    fireEvent.click(exportButton);
    
    const cancelButton = screen.getByText('Cancel');
    expect(cancelButton).toBeDisabled();
  });
});
