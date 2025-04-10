
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { exportWireframe, generateHtmlFromWireframe, dataURItoBlob, ExportError } from '../export-utils';
import { toast } from 'sonner';
import { recordClientError } from '@/utils/monitoring/api-usage';

// Mock dependencies
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
    default: vi.fn(),
  }
}));

vi.mock('@/utils/monitoring/api-usage', () => ({
  recordClientError: vi.fn().mockResolvedValue(undefined)
}));

vi.mock('html2canvas', () => ({
  default: vi.fn().mockResolvedValue({
    toDataURL: vi.fn().mockReturnValue('data:image/jpeg;base64,/9j/4AAQSkZ'),
    toBlob: vi.fn().mockImplementation((callback) => callback(new Blob(['test'], { type: 'image/png' })))
  })
}));

vi.mock('jspdf', () => ({
  jsPDF: vi.fn().mockImplementation(() => ({
    addImage: vi.fn(),
    save: vi.fn(),
    getImageProperties: vi.fn().mockReturnValue({ width: 100, height: 100 }),
    internal: {
      pageSize: {
        getWidth: vi.fn().mockReturnValue(595),
      },
    },
  })),
}));

describe('Export Utils', () => {
  const mockWireframeData = {
    id: 'test-id',
    title: 'Test Wireframe',
    description: 'Test description',
    sections: [
      {
        id: 'section-1',
        name: 'Section 1',
        description: 'Section 1 description',
        components: []
      }
    ]
  };
  
  const mockElement = document.createElement('div');
  mockElement.id = 'wireframe-canvas';

  beforeEach(() => {
    // Add mock element to DOM
    document.body.appendChild(mockElement);
    
    // Reset mocks
    vi.clearAllMocks();
    
    // Mock URL.createObjectURL and URL.revokeObjectURL
    global.URL.createObjectURL = vi.fn().mockReturnValue('blob:test');
    global.URL.revokeObjectURL = vi.fn();
    
    // Mock createElement and appendChild
    const mockLink = {
      href: '',
      download: '',
      click: vi.fn()
    };
    document.createElement = vi.fn().mockImplementation((tagName) => {
      if (tagName === 'a') return mockLink;
      return document.createElement(tagName);
    });
    document.body.appendChild = vi.fn();
    document.body.removeChild = vi.fn();
  });

  afterEach(() => {
    // Clean up DOM
    if (document.getElementById('wireframe-canvas')) {
      document.body.removeChild(mockElement);
    }
  });

  describe('exportWireframe', () => {
    it('should export as JSON successfully', async () => {
      await exportWireframe(mockWireframeData, 'json');
      expect(toast).toHaveBeenCalledWith('Wireframe exported successfully as JSON');
    });
    
    it('should export as HTML successfully', async () => {
      await exportWireframe(mockWireframeData, 'html');
      expect(toast).toHaveBeenCalledWith('Wireframe exported successfully as HTML');
    });
    
    it('should export as PDF successfully', async () => {
      await exportWireframe(mockWireframeData, 'pdf');
      expect(toast).toHaveBeenCalledWith('Wireframe exported successfully as PDF');
    });

    it('should export as PNG successfully', async () => {
      await exportWireframe(mockWireframeData, 'png');
      expect(toast).toHaveBeenCalledWith('Wireframe exported successfully as PNG');
    });

    it('should throw and handle error for unsupported format', async () => {
      await expect(exportWireframe(mockWireframeData, 'invalid' as any)).rejects.toThrow(ExportError);
      expect(toast.error).toHaveBeenCalled();
      expect(recordClientError).toHaveBeenCalled();
    });
    
    it('should respect the filename from options', async () => {
      const options = { fileName: 'custom-filename' };
      await exportWireframe(mockWireframeData, 'json', options);
      expect(document.createElement).toHaveBeenCalledWith('a');
    });
  });

  describe('generateHtmlFromWireframe', () => {
    it('should generate valid HTML from wireframe data', () => {
      const html = generateHtmlFromWireframe(mockWireframeData);
      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('Test Wireframe');
      expect(html).toContain('Test description');
      expect(html).toContain('Section 1');
    });

    it('should handle empty wireframe data', () => {
      const html = generateHtmlFromWireframe({ id: 'empty', sections: [] });
      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('Wireframe Export');
      expect(html).not.toContain('wireframe-section');
    });
    
    it('should apply color scheme from wireframe data', () => {
      const dataWithColors = {
        ...mockWireframeData,
        colorScheme: {
          background: '#f0f0f0',
          text: '#333333',
          primary: '#0070f3'
        }
      };
      const html = generateHtmlFromWireframe(dataWithColors);
      expect(html).toContain('#f0f0f0');
      expect(html).toContain('#333333');
      expect(html).toContain('#0070f3');
    });
  });

  describe('dataURItoBlob', () => {
    it('should convert data URI to blob', () => {
      const dataURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
      const blob = dataURItoBlob(dataURI);
      expect(blob).toBeInstanceOf(Blob);
    });

    it('should throw ExportError for ArrayBuffer input', () => {
      const arrayBuffer = new ArrayBuffer(8);
      expect(() => dataURItoBlob(arrayBuffer)).toThrow(ExportError);
    });

    it('should handle plain string input', () => {
      const plainString = 'test string';
      const blob = dataURItoBlob(plainString);
      expect(blob).toBeInstanceOf(Blob);
    });
  });
});
