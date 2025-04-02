
/**
 * Configuration options for PDF generation
 */
export interface PDFGenerationOptions {
  /** Quality of the PDF (1-4, where 4 is highest) */
  quality?: 1 | 2 | 3 | 4;
  /** Whether to show a progress toast */
  showProgress?: boolean;
  /** Custom margin in millimeters */
  margin?: number;
  /** Maximum canvas dimension to prevent memory issues */
  maxCanvasDimension?: number;
  /** Filename for the exported PDF (without extension) */
  filename?: string;
  /** Document styling options */
  styling?: {
    /** Header image URL (optional) */
    headerImageUrl?: string;
    /** Primary color for headings and accents (hex format) */
    primaryColor?: string;
    /** Secondary color for subheadings and minor elements (hex format) */
    secondaryColor?: string;
    /** Font family for document text */
    fontFamily?: 'helvetica' | 'courier' | 'times' | 'symbol' | 'zapfdingbats';
    /** Include page numbers */
    showPageNumbers?: boolean;
    /** Include date in header/footer */
    showDate?: boolean;
    /** Custom footer text */
    footerText?: string;
  };
}

/**
 * Default PDF generation options
 */
export const defaultOptions: PDFGenerationOptions = {
  quality: 2,
  showProgress: true,
  margin: 0,
  maxCanvasDimension: 10000, // 10k pixels max dimension to prevent memory issues
  styling: {
    primaryColor: '#000000',
    secondaryColor: '#666666',
    fontFamily: 'helvetica',
    showPageNumbers: true,
    showDate: false,
    footerText: ''
  }
};

