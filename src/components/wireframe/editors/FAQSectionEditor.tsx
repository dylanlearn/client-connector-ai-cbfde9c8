
import React, { useState } from 'react';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X, Plus } from 'lucide-react';

interface FAQSectionEditorProps {
  section: WireframeSection;
  onUpdate: (updates: Partial<WireframeSection>) => void;
}

const FAQSectionEditor: React.FC<FAQSectionEditorProps> = ({ section, onUpdate }) => {
  // Extract section data
  const data = section.data || {};
  const {
    title = 'Frequently Asked Questions',
    subtitle = 'Find answers to common questions about our services',
    faqs = [],
    backgroundStyle = 'light',
    alignment = 'center'
  } = data;
  
  // State for editing FAQs
  const [activeTab, setActiveTab] = useState<string>('general');
  
  // Update general section data
  const updateData = (key: string, value: any) => {
    const updatedData = { ...data, [key]: value };
    onUpdate({ data: updatedData });
  };
  
  // Update a specific FAQ item
  const updateFAQ = (index: number, field: string, value: string) => {
    const updatedFAQs = [...faqs];
    updatedFAQs[index] = { ...updatedFAQs[index], [field]: value };
    updateData('faqs', updatedFAQs);
  };
  
  // Add new FAQ
  const addFAQ = () => {
    const updatedFAQs = [...faqs, { 
      question: 'New question?', 
      answer: 'Add your answer here.' 
    }];
    updateData('faqs', updatedFAQs);
  };
  
  // Remove FAQ
  const removeFAQ = (index: number) => {
    const updatedFAQs = faqs.filter((_, i) => i !== index);
    updateData('faqs', updatedFAQs);
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="general">General Settings</TabsTrigger>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <div className="grid gap-4">
            <div>
              <Label>Section Title</Label>
              <Input
                value={title}
                onChange={(e) => updateData('title', e.target.value)}
                placeholder="FAQ Section Title"
              />
            </div>
            
            <div>
              <Label>Subtitle / Description</Label>
              <Textarea
                value={subtitle}
                onChange={(e) => updateData('subtitle', e.target.value)}
                placeholder="A brief description of the FAQ section"
                rows={3}
              />
            </div>
            
            <div>
              <Label>Background Style</Label>
              <Select 
                value={backgroundStyle}
                onValueChange={(value) => updateData('backgroundStyle', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="primary">Primary</SelectItem>
                  <SelectItem value="secondary">Secondary</SelectItem>
                  <SelectItem value="muted">Muted</SelectItem>
                  <SelectItem value="gray">Gray</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Text Alignment</Label>
              <Select 
                value={alignment}
                onValueChange={(value) => updateData('alignment', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="faqs" className="space-y-4">
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="border p-4 rounded-md relative">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-2 right-2" 
                  onClick={() => removeFAQ(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
                
                <div className="space-y-3">
                  <div>
                    <Label>Question {index + 1}</Label>
                    <Input
                      value={faq.question}
                      onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                      placeholder="Enter question"
                    />
                  </div>
                  
                  <div>
                    <Label>Answer</Label>
                    <Textarea
                      value={faq.answer}
                      onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                      placeholder="Enter answer"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            ))}
            
            <Button onClick={addFAQ} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add New FAQ
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FAQSectionEditor;
