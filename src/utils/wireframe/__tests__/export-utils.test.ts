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
  const testWireframe = {
    id: 'test-id',
    title: 'Test Wireframe',
    description: 'Test wireframe description',
    sections: [
      {
        id: 'section-1',
        name: 'Test Section',
        sectionType: 'hero',
        description: 'A test section'
      }
    ],
    colorScheme: {
      primary: '#3182CE',
      secondary: '#805AD5',
      accent: '#ED8936',
      background: '#FFFFFF',
      text: '#1A202C'
    },
    typography: {
      headings: 'Inter',
      body: 'Inter'
    }
  };

  it('should generate HTML from wireframe', async () => {
    const html = await exportWireframeAsHTML(testWireframe);
    expect(html).toContain('Test Wireframe');
    expect(html).toContain('Test Section');
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
    const html = generateHtmlFromWireframe(testWireframe);
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
