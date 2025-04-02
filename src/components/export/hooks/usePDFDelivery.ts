
import { useState } from "react";
import { downloadPDF, sendPDFByEmail, sendPDFBySMS } from "@/utils/pdf-export";
import { toast } from "sonner";

export const usePDFDelivery = (filename: string) => {
  const [isDeliveringPDF, setIsDeliveringPDF] = useState(false);

  const handleDownload = (pdfBlob: Blob | null, onSuccess?: () => void) => {
    if (!pdfBlob) return;
    
    downloadPDF(pdfBlob, filename);
    if (onSuccess) onSuccess();
  };

  const handleEmailSend = async (
    pdfBlob: Blob | null, 
    email: string, 
    subject: string, 
    message: string,
    onSuccess?: () => void
  ) => {
    if (!pdfBlob || !email) return;
    
    setIsDeliveringPDF(true);
    try {
      const success = await sendPDFByEmail(pdfBlob, email, subject, message);
      if (success && onSuccess) {
        onSuccess();
      }
    } finally {
      setIsDeliveringPDF(false);
    }
  };

  const handleSMSSend = async (
    pdfBlob: Blob | null, 
    phoneNumber: string, 
    message: string,
    onSuccess?: () => void
  ) => {
    if (!pdfBlob || !phoneNumber) return;
    
    setIsDeliveringPDF(true);
    try {
      const success = await sendPDFBySMS(pdfBlob, phoneNumber, message);
      if (success && onSuccess) {
        onSuccess();
      }
    } finally {
      setIsDeliveringPDF(false);
    }
  };

  const copyLinkToClipboard = (pdfUrl: string | null) => {
    if (pdfUrl) {
      navigator.clipboard.writeText(pdfUrl);
      toast.success("Link copied to clipboard");
    }
  };

  return {
    isDeliveringPDF,
    handleDownload,
    handleEmailSend,
    handleSMSSend,
    copyLinkToClipboard
  };
};
