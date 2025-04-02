
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText } from "lucide-react";
import { LoadingOverlay } from "./LoadingOverlay";
import { PDFTemplatesDialog } from "./PDFTemplatesDialog";
import { DownloadTab } from "./tabs/DownloadTab";
import { EmailTab } from "./tabs/EmailTab";
import { SMSTab } from "./tabs/SMSTab";
import { PDFExportProvider, usePDFExport } from "./context/PDFExportContext";
import { usePDFDelivery } from "./hooks/usePDFDelivery";
import { PDFExternalServices } from "./PDFExternalServices";
import { toast } from "sonner";

interface PDFExportDialogProps {
  contentId: string;
  filename: string;
  trigger?: React.ReactNode;
}

// Inner component that uses the context
function PDFExportDialogContent() {
  const { 
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
    copyLinkToClipboard
  } = usePDFExport();

  const { 
    isDeliveringPDF,
    handleDownload: deliveryHandleDownload,
    handleEmailSend,
    handleSMSSend
  } = usePDFDelivery("document");
  
  const handleCloseDialog = () => {
    // Access Dialog's close functionality through DialogContent's context
    // This will be handled by the Dialog's onOpenChange
  };

  const handleDownload = () => {
    if (pdfBlob) {
      deliveryHandleDownload(pdfBlob);
    }
  };

  const handleEmailDelivery = async () => {
    await handleEmailSend(pdfBlob, email, subject, message);
  };

  const handleSMSDelivery = async () => {
    await handleSMSSend(pdfBlob, phoneNumber, message);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Export Design Brief</DialogTitle>
        <DialogDescription>
          Export your design brief as a PDF file or share it directly.
        </DialogDescription>
      </DialogHeader>

      {isLoading || isDeliveringPDF ? (
        <div className="relative py-8">
          <LoadingOverlay message={isDeliveringPDF ? "Sending your document..." : "Preparing your document..."} />
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="download">Download</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="sms">SMS</TabsTrigger>
          </TabsList>

          <TabsContent value="download" className="py-4">
            <div className="flex justify-end mb-2">
              <PDFTemplatesDialog 
                pdfOptions={pdfOptions} 
                onApplyTemplate={handleApplyTemplate} 
              />
            </div>
            <DownloadTab 
              pdfOptions={pdfOptions}
              updatePdfOption={updatePdfOption}
              handleDownload={handleDownload}
              handleRegenerate={handleRegenerate}
              pdfBlob={pdfBlob}
            />

            <PDFExternalServices 
              handleDownload={handleDownload}
              pdfUrl={pdfUrl}
              onCopyLink={copyLinkToClipboard}
            />
          </TabsContent>

          <TabsContent value="email" className="py-4">
            <EmailTab 
              email={email}
              setEmail={setEmail}
              subject={subject}
              setSubject={setSubject}
              message={message}
              setMessage={setMessage}
              handleEmailSend={handleEmailDelivery}
              isLoading={isLoading || isDeliveringPDF}
            />
          </TabsContent>

          <TabsContent value="sms" className="py-4">
            <SMSTab 
              phoneNumber={phoneNumber}
              setPhoneNumber={setPhoneNumber}
              message={message}
              setMessage={setMessage}
              handleSMSSend={handleSMSDelivery}
              isLoading={isLoading || isDeliveringPDF}
            />
          </TabsContent>
        </Tabs>
      )}

      <DialogFooter>
        <Button variant="outline" onClick={handleCloseDialog}>
          Cancel
        </Button>
      </DialogFooter>
    </>
  );
}

// Main component that wraps the content with the context provider
export function PDFExportDialog({ contentId, filename, trigger }: PDFExportDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="gap-2">
            <FileText className="h-4 w-4" />
            Export PDF
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <PDFExportProvider 
          contentId={contentId} 
          filename={filename}
          isOpen={isOpen}
        >
          <PDFExportDialogContent />
        </PDFExportProvider>
      </DialogContent>
    </Dialog>
  );
}
