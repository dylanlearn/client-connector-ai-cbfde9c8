
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PDFStylingTemplate, fetchPDFTemplates, savePDFTemplate, deletePDFTemplate } from "@/utils/pdf-export/templates";
import { PDFGenerationOptions } from "@/utils/pdf-export";
import { Plus, Save, Trash2, Check, FileText } from "lucide-react";

interface PDFTemplatesDialogProps {
  pdfOptions: PDFGenerationOptions;
  onApplyTemplate: (template: PDFStylingTemplate) => void;
}

export function PDFTemplatesDialog({ pdfOptions, onApplyTemplate }: PDFTemplatesDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [templates, setTemplates] = useState<PDFStylingTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveForm, setShowSaveForm] = useState(false);
  
  // Form state
  const [templateName, setTemplateName] = useState("");
  const [templateDescription, setTemplateDescription] = useState("");
  
  // Load templates when dialog opens
  useEffect(() => {
    if (isOpen) {
      loadTemplates();
    }
  }, [isOpen]);
  
  const loadTemplates = async () => {
    setIsLoading(true);
    try {
      const data = await fetchPDFTemplates();
      setTemplates(data);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSaveTemplate = async () => {
    if (!templateName.trim()) return;
    
    setIsSaving(true);
    try {
      const savedTemplate = await savePDFTemplate(
        templateName,
        templateDescription,
        pdfOptions.styling || {}
      );
      
      if (savedTemplate) {
        setTemplates([savedTemplate, ...templates]);
        setTemplateName("");
        setTemplateDescription("");
        setShowSaveForm(false);
      }
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleDeleteTemplate = async (templateId: string) => {
    const success = await deletePDFTemplate(templateId);
    if (success) {
      setTemplates(templates.filter(t => t.id !== templateId));
    }
  };
  
  const handleApplyTemplate = (template: PDFStylingTemplate) => {
    onApplyTemplate(template);
    setIsOpen(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <FileText className="h-4 w-4" />
          Templates
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>PDF Styling Templates</DialogTitle>
          <DialogDescription>
            Save and manage your PDF styling templates for reuse
          </DialogDescription>
        </DialogHeader>
        
        {/* Template list */}
        <div className="space-y-4">
          {!showSaveForm && (
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-center gap-2"
              onClick={() => setShowSaveForm(true)}
            >
              <Plus className="h-4 w-4" />
              Save Current Styling as Template
            </Button>
          )}
          
          {showSaveForm && (
            <div className="space-y-3 border rounded-md p-3">
              <div className="space-y-2">
                <Label htmlFor="template-name">Template Name</Label>
                <Input
                  id="template-name"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="My Company Brand"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="template-description">Description (Optional)</Label>
                <Textarea
                  id="template-description"
                  value={templateDescription}
                  onChange={(e) => setTemplateDescription(e.target.value)}
                  placeholder="Official branding for client documents"
                  rows={2}
                />
              </div>
              
              <div className="flex gap-2 justify-end">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowSaveForm(false)}
                >
                  Cancel
                </Button>
                <Button 
                  size="sm" 
                  className="gap-2"
                  onClick={handleSaveTemplate}
                  disabled={!templateName.trim() || isSaving}
                >
                  <Save className="h-4 w-4" />
                  Save Template
                </Button>
              </div>
            </div>
          )}
          
          {isLoading ? (
            <div className="text-center py-4 text-muted-foreground">
              Loading templates...
            </div>
          ) : templates.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No saved templates yet
            </div>
          ) : (
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {templates.map((template) => (
                <div 
                  key={template.id}
                  className="border rounded-md p-3 flex justify-between items-start"
                >
                  <div>
                    <h4 className="font-medium">{template.name}</h4>
                    {template.description && (
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                    )}
                    {template.is_company_default && (
                      <span className="text-xs bg-blue-100 text-blue-800 rounded px-1.5 py-0.5 inline-block mt-1">
                        Company Default
                      </span>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-destructive"
                      onClick={() => handleDeleteTemplate(template.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => handleApplyTemplate(template)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
