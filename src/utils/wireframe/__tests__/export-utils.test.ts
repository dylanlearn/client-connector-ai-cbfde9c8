
import { describe, it, expect, vi } from 'vitest';
import { 
  exportWireframeAsHTML, 
  exportWireframeAsPDF, 
  exportWireframeAsImage,
  generateHtmlFromWireframe,
  handleExportError
} from '../export-utils';

// Mock html2canvas and jsPDF
vi.mock('html2canvas', () => ({
  default: vi.fn().mockResolvedValue({
    toDataURL: vi.fn().mockReturnValue('data:image/png;base64,mockImageData'),
    width: 1000,
    height: 800,
    toBlob: vi.fn().mockImplementation((cb) => cb(new Blob(['mock'], { type: 'image/png' })))
  })
}));

vi.mock('jspdf', () => ({
  default: vi.fn().mockImplementation(() => ({
    addImage: vi.fn(),
    output: vi.fn().mockReturnValue(new Blob(['mockPdfData'], { type: 'application/pdf' }))
  }))
}));

describe('Export Utils', () => {
  const mockWireframe = {
    id: 'test-id',
    title: 'Test Wireframe',
    sections: [
      {
        id: 'section-1',
        name: 'Hero Section',
        sectionType: 'hero',
        description: 'A hero section'
      }
    ],
    colorScheme: {
      primary: '#3182ce',
      secondary: '#805ad5',
      accent: '#ed8936',
      background: '#ffffff',
      text: '#1a202c'
    },
    typography: {
      headings: 'sans-serif',
      body: 'sans-serif'
    }
  };

  it('should generate HTML from wireframe', async () => {
    const html = await exportWireframeAsHTML(mockWireframe);
    expect(html).toContain('Test Wireframe');
    expect(html).toContain('Hero Section');
  });

  it('should generate PDF from element', async () => {
    const mockElement = document.createElement('div');
    const blob = await exportWireframeAsPDF(mockElement);
    expect(blob).toBeInstanceOf(Blob);
  });

  it('should generate image from element', async () => {
    const mockElement = document.createElement('div');
    const blob = await exportWireframeAsImage(mockElement);
    expect(blob).toBeInstanceOf(Blob);
  });

  it('should generate HTML code for web projects', () => {
    const html = generateHtmlFromWireframe(mockWireframe);
    expect(html).toContain('Test Wireframe');
    expect(html).toContain('wireframe-section-hero');
  });

  it('should handle export errors', () => {
    const errorMessage = 'Test error';
    const error = new Error(errorMessage);
    const result = handleExportError(error);
    expect(result).toBe(errorMessage);
  });
});
