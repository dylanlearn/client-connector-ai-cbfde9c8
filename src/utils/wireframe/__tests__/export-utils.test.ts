
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { exportWireframeAsHTML, exportWireframeAsPDF, exportWireframeAsImage } from '../export-utils';

// Mock dependencies
vi.mock('html2canvas', () => ({
  default: vi.fn(() => Promise.resolve({
    toDataURL: () => 'mock-data-url',
    toBlob: (cb) => cb(new Blob(['mock-blob'])),
    width: 800,
    height: 600
  }))
}));

vi.mock('jspdf', () => ({
  default: class MockJsPDF {
    constructor() { }
    addImage() { return this; }
    output() { return new Blob(['mock-pdf']); }
  }
}));

describe('Wireframe Export Utils', () => {
  let mockWireframe;
  let mockElement;

  beforeEach(() => {
    mockWireframe = {
      id: 'mock-id',
      title: 'Mock Wireframe',
      sections: [
        {
          id: 'section-1',
          name: 'Hero Section',
          sectionType: 'hero',
          copySuggestions: {
            heading: 'Welcome to Mock Wireframe',
            subheading: 'This is a mock wireframe for testing'
          }
        },
        {
          id: 'section-2',
          name: 'Features Section',
          sectionType: 'features'
        }
      ]
    };

    mockElement = document.createElement('div');
  });

  describe('exportWireframeAsHTML', () => {
    it('should generate HTML from wireframe data', async () => {
      const html = await exportWireframeAsHTML(mockWireframe);
      expect(typeof html).toBe('string');
      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain(mockWireframe.title);
      expect(html).toContain('Welcome to Mock Wireframe');
    });

    it('should include sections based on their type', async () => {
      const html = await exportWireframeAsHTML(mockWireframe);
      expect(html).toContain('hero');
      expect(html).toContain('features');
    });
  });

  describe('exportWireframeAsPDF', () => {
    it('should generate PDF from element', async () => {
      const blob = await exportWireframeAsPDF(mockElement, mockWireframe);
      expect(blob).toBeInstanceOf(Blob);
    });
  });

  describe('exportWireframeAsImage', () => {
    it('should generate Image from element', async () => {
      const blob = await exportWireframeAsImage(mockElement, mockWireframe);
      expect(blob).toBeInstanceOf(Blob);
    });
  });
});
