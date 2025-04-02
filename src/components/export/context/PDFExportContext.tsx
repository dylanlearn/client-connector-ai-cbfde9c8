
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { generatePDF, PDFGenerationOptions, applyPDFTemplate, PDFStylingTemplate } from "@/utils/pdf-export";
import { useAuth } from "@/hooks/use-auth";

interface PDFExportContextType {
  isLoading: boolean;
  pdfBlob: Blob | null;
  pdfUrl: string | null;
  pdfOptions: PDFGenerationOptions;
  activeTab: string;
  email: string;
  phoneNumber: string;
  subject: string;
  message: string;
  setActiveTab: (tab: string) => void;
  setEmail: (email: string) => void;
  setPhoneNumber: (phone: string) => void;
  setSubject: (subject: string) => void;
  setMessage: (message: string) => void;
  updatePdfOption: (key: keyof PDFGenerationOptions, value: any) => void;
  handleRegenerate: () => Promise<void>;
  handleApplyTemplate: (template: PDFStylingTemplate) => void;
  copyLinkToClipboard: () => void;
}

const PDFExportContext = createContext<PDFExportContextType | undefined>(undefined);

interface PDFExportProviderProps {
  children: ReactNode;
  contentId: string;
  filename: string;
  isOpen: boolean;
}

export const PDFExportProvider = ({ 
  children, 
  contentId, 
  filename,
  isOpen 
}: PDFExportProviderProps) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("download");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [subject, setSubject] = useState("Your Design Brief");
  const [message, setMessage] = useState("");
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfOptions, setPdfOptions] = useState<PDFGenerationOptions>({
    quality: 2,
    showProgress: true,
    margin: 5,
    filename: filename
  });

  useEffect(() => {
    // If user is available and email is not set, initialize with user's email
    if (user?.email && !email) {
      setEmail(user.email);
    }
  }, [user, email]);

  useEffect(() => {
    // Cleanup URL when dialog closes
    if (!isOpen && pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }
  }, [isOpen, pdfUrl]);

  useEffect(() => {
    // Generate PDF when dialog opens
    const generateInitialPDF = async () => {
      if (isOpen && !pdfBlob) {
        setIsLoading(true);
        try {
          const blob = await generatePDF(contentId, filename, pdfOptions);
          setPdfBlob(blob);
          if (blob) {
            const url = URL.createObjectURL(blob);
            setPdfUrl(url);
          }
        } finally {
          setIsLoading(false);
        }
      }
    };

    generateInitialPDF();
  }, [isOpen, pdfBlob, contentId, filename, pdfOptions]);

  // Update filename when prop changes
  useEffect(() => {
    setPdfOptions(prev => ({ ...prev, filename }));
  }, [filename]);

  const handleRegenerate = async () => {
    setIsLoading(true);
    try {
      const blob = await generatePDF(contentId, filename, pdfOptions);
      setPdfBlob(blob);
      if (blob) {
        // Revoke old URL if it exists
        if (pdfUrl) {
          URL.revokeObjectURL(pdfUrl);
        }
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updatePdfOption = (key: keyof PDFGenerationOptions, value: any) => {
    setPdfOptions(prev => ({ ...prev, [key]: value }));
    setPdfBlob(null); // Clear the cached PDF to force regeneration with new options
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }
  };

  const handleApplyTemplate = (template: PDFStylingTemplate) => {
    const updatedOptions = applyPDFTemplate(pdfOptions, template);
    setPdfOptions(updatedOptions);
    setPdfBlob(null); // Clear cached PDF to force regeneration with new styling
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }
  };

  const copyLinkToClipboard = () => {
    if (pdfUrl) {
      navigator.clipboard.writeText(pdfUrl);
      toast.success("Link copied to clipboard");
    }
  };

  const value = {
    isLoading,
    pdfBlob,
    pdfUrl,
    pdfOptions,
    activeTab,
    email,
    phoneNumber,
    subject,
    message,
    setActiveTab,
    setEmail,
    setPhoneNumber,
    setSubject,
    setMessage,
    updatePdfOption,
    handleRegenerate,
    handleApplyTemplate,
    copyLinkToClipboard,
  };

  return (
    <PDFExportContext.Provider value={value}>
      {children}
    </PDFExportContext.Provider>
  );
};

export const usePDFExport = () => {
  const context = useContext(PDFExportContext);
  if (context === undefined) {
    throw new Error("usePDFExport must be used within a PDFExportProvider");
  }
  return context;
};
