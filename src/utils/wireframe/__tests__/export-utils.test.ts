
import { describe, it, expect, vi } from 'vitest';
import { 
  generateHtmlFromWireframe, 
  handleExportError,
  exportWireframeAsHTML,
  exportWireframeAsPDF,
  exportWireframeAsImage
} from '../export-utils';

// Mock the downloadFile functionality
global.URL.createObjectURL = vi.fn(() => 'blob:test-url');
global.URL.revokeObjectURL = vi.fn();

// Mock document functions
document.createElement = vi.fn(() => ({
  href: '',
  download: '',
  click: vi.fn(),
}));

document.body.appendChild = vi.fn();
document.body.removeChild = vi.fn();

// Mock html2canvas and jsPDF
vi.mock('html2canvas', () => ({
  default: vi.fn(() => Promise.resolve({
    toDataURL: vi.fn(() => 'data:image/png;base64,test'),
    height: 600,
    width: 800
  }))
}));

vi.mock('jspdf', () => ({
  jsPDF: vi.fn(() => ({
    setFontSize: vi.fn(),
    text: vi.fn(),
    addImage: vi.fn(),
    save: vi.fn()
  }))
}));

describe('Export Utils', () => {
  it('should generate HTML from wireframe', () => {
    const wireframe = {
      id: 'test-wireframe',
      title: 'Test Wireframe',
      sections: []
    };
    
    const result = generateHtmlFromWireframe(wireframe);
    expect(result).toBeDefined();
    expect(result).toContain('Test Wireframe');
  });
  
  it('should handle export errors', () => {
    const errorMessage = 'Test error message';
    const result = handleExportError(errorMessage);
    expect(result).toContain(errorMessage);
  });
  
  it('should export wireframe as HTML', () => {
    const wireframe = {
      id: 'test-wireframe',
      title: 'Test Wireframe',
      sections: []
    };
    
    exportWireframeAsHTML(wireframe);
    
    expect(document.createElement).toHaveBeenCalledWith('a');
    expect(document.body.appendChild).toHaveBeenCalled();
    expect(document.body.removeChild).toHaveBeenCalled();
  });
});
