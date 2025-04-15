import { describe, it, expect, vi } from 'vitest';
import { 
  exportWireframeAsHTML, 
  exportWireframeAsPDF, 
  exportWireframeAsImage,
  generateHtmlFromWireframe,
  handleExportError
} from '../export-utils';
import { WireframeData, WireframeSection } from '@/services/ai/wireframe/wireframe-types';

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

const testWireframeData = {
  id: 'test-wireframe',
  title: 'Test Wireframe',
  description: 'A test wireframe',
  sections: [
    {
      id: 'section-1',
      name: 'Section 1',
      sectionType: 'hero',
      description: 'Test section',
      components: [] // Add this required field to fix the error
    }
  ],
  colorScheme: {
    primary: '#000000',
    secondary: '#ffffff',
    accent: '#ff0000',
    background: '#f5f5f5',
    text: '#333333'
  },
  typography: {
    headings: 'Arial',
    body: 'Helvetica'
  }
};

describe('Export Utils', () => {
  it('should generate HTML from wireframe', async () => {
    const html = await exportWireframeAsHTML(testWireframeData);
    expect(html).toContain('Test Wireframe');
    expect(html).toContain('Section 1');
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
    const html = generateHtmlFromWireframe(testWireframeData);
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
