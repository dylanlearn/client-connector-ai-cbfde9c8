
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { generatePDF, downloadPDF, sendPDFByEmail, sendPDFBySMS } from "@/utils/pdf-export";
import { Loader2, Mail, Phone, Download, FileText } from "lucide-react";

interface PDFExportDialogProps {
  contentId: string;
  filename: string;
  trigger?: React.ReactNode;
}

export function PDFExportDialog({ contentId, filename, trigger }: PDFExportDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("download");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [subject, setSubject] = useState("Your Design Brief");
  const [message, setMessage] = useState("");
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);

  const handleOpen = async (open: boolean) => {
    setIsOpen(open);
    if (open && !pdfBlob) {
      setIsLoading(true);
      try {
        const blob = await generatePDF(contentId, filename);
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

  return (
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
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-sm text-muted-foreground">Preparing your document...</p>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="download">Download</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="sms">SMS</TabsTrigger>
            </TabsList>

            <TabsContent value="download" className="py-4">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Download the design brief as a PDF file to your device.
                </p>
                <div className="flex justify-center">
                  <Button onClick={handleDownload} className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="email" className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="client@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input 
                  id="subject" 
                  placeholder="Your Design Brief" 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Message (Optional)</Label>
                <Textarea 
                  id="message" 
                  placeholder="Here's the design brief we discussed..." 
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
              
              <Button 
                onClick={handleEmailSend} 
                disabled={!email || isLoading}
                className="w-full"
              >
                <Mail className="mr-2 h-4 w-4" />
                Send via Email
              </Button>
            </TabsContent>

            <TabsContent value="sms" className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone" 
                  type="tel" 
                  placeholder="+1234567890" 
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Include country code (e.g., +1 for US)
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="smsMessage">Message (Optional)</Label>
                <Textarea 
                  id="smsMessage" 
                  placeholder="Here's your design brief..." 
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
              
              <Button 
                onClick={handleSMSSend} 
                disabled={!phoneNumber || isLoading}
                className="w-full"
              >
                <Phone className="mr-2 h-4 w-4" />
                Send via SMS
              </Button>
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
  );
}
