
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generatePDF, downloadPDF, sendPDFByEmail, sendPDFBySMS, PDFGenerationOptions } from "@/utils/pdf-export";
import { FileText, ArrowUpRight, MessageSquare } from "lucide-react";
import { DownloadTab } from "./tabs/DownloadTab";
import { EmailTab } from "./tabs/EmailTab";
import { SMSTab } from "./tabs/SMSTab";
import { LoadingOverlay } from "./LoadingOverlay";
import { useAuth } from "@/hooks/use-auth";
import { PDFTemplatesDialog } from "./PDFTemplatesDialog";
import { PDFStylingTemplate, applyPDFTemplate } from "@/utils/pdf-export/templates";
import { NotionExportDialog } from "./integration-dialogs/NotionExportDialog";
import { SlackExportDialog } from "./integration-dialogs/SlackExportDialog";

interface PDFExportDialogProps {
  contentId: string;
  filename: string;
  trigger?: React.ReactNode;
}

export function PDFExportDialog({ contentId, filename, trigger }: PDFExportDialogProps) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("download");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [subject, setSubject] = useState("Your Design Brief");
  const [message, setMessage] = useState("");
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [pdfOptions, setPdfOptions] = useState<PDFGenerationOptions>({
    quality: 2,
    showProgress: true,
    margin: 5
  });

  // Integration states
  const [showNotionDialog, setShowNotionDialog] = useState(false);
  const [showSlackDialog, setShowSlackDialog] = useState(false);

  useEffect(() => {
    // If user is available and email is not set, initialize with user's email
    if (user?.email && !email) {
      setEmail(user.email);
    }
  }, [user, email]);

  const handleOpen = async (open: boolean) => {
    setIsOpen(open);
    if (open && !pdfBlob) {
      setIsLoading(true);
      try {
        const blob = await generatePDF(contentId, filename, pdfOptions);
        setPdfBlob(blob);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDownload = () => {
    if (pdfBlob) {
      downloadPDF(pdfBlob, filename);
      setIsOpen(false);
    }
  };

  const handleEmailSend = async () => {
    if (!pdfBlob || !email) return;
    
    setIsLoading(true);
    try {
      const success = await sendPDFByEmail(pdfBlob, email, subject, message);
      if (success) {
        setIsOpen(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSMSSend = async () => {
    if (!pdfBlob || !phoneNumber) return;
    
    setIsLoading(true);
    try {
      const success = await sendPDFBySMS(pdfBlob, phoneNumber, message);
      if (success) {
        setIsOpen(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = async () => {
    setIsLoading(true);
    try {
      const blob = await generatePDF(contentId, filename, pdfOptions);
      setPdfBlob(blob);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePdfOption = (key: keyof PDFGenerationOptions, value: any) => {
    setPdfOptions(prev => ({ ...prev, [key]: value }));
    setPdfBlob(null); // Clear the cached PDF to force regeneration with new options
  };

  const handleApplyTemplate = (template: PDFStylingTemplate) => {
    const updatedOptions = applyPDFTemplate(pdfOptions, template);
    setPdfOptions(updatedOptions);
    setPdfBlob(null); // Clear cached PDF to force regeneration with new styling
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleOpen}>
        <DialogTrigger asChild>
          {trigger || (
            <Button variant="outline" className="gap-2">
              <FileText className="h-4 w-4" />
              Export PDF
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Export Design Brief</DialogTitle>
            <DialogDescription>
              Export your design brief as a PDF file or share it directly.
            </DialogDescription>
          </DialogHeader>

          {isLoading ? (
            <LoadingOverlay />
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

                <div className="mt-4 pt-4 border-t space-y-3">
                  <h4 className="text-sm font-medium">Export to other platforms</h4>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-1 flex-1"
                      onClick={() => {
                        if (pdfBlob) {
                          setShowNotionDialog(true);
                          setIsOpen(false);
                        }
                      }}
                      disabled={!pdfBlob}
                    >
                      <ArrowUpRight className="h-4 w-4" />
                      Notion
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-1 flex-1"
                      onClick={() => {
                        if (pdfBlob) {
                          setShowSlackDialog(true);
                          setIsOpen(false);
                        }
                      }}
                      disabled={!pdfBlob}
                    >
                      <MessageSquare className="h-4 w-4" />
                      Slack
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="email" className="py-4">
                <EmailTab 
                  email={email}
                  setEmail={setEmail}
                  subject={subject}
                  setSubject={setSubject}
                  message={message}
                  setMessage={setMessage}
                  handleEmailSend={handleEmailSend}
                  isLoading={isLoading}
                />
              </TabsContent>

              <TabsContent value="sms" className="py-4">
                <SMSTab 
                  phoneNumber={phoneNumber}
                  setPhoneNumber={setPhoneNumber}
                  message={message}
                  setMessage={setMessage}
                  handleSMSSend={handleSMSSend}
                  isLoading={isLoading}
                />
              </TabsContent>
            </Tabs>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Separate dialog for Notion export */}
      {showNotionDialog && (
        <NotionExportDialog
          pdfBlob={pdfBlob}
          title={filename}
          trigger={<div style={{ display: 'none' }} />}
        />
      )}

      {/* Separate dialog for Slack export */}
      {showSlackDialog && (
        <SlackExportDialog
          pdfBlob={pdfBlob}
          title={filename}
          trigger={<div style={{ display: 'none' }} />}
        />
      )}
    </>
  );
}
