
import React, { useState } from 'react';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ColorPicker } from '@/components/ui/color-picker';
import { Plus, Trash2, MoveUp, MoveDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import RichTextEditor from './RichTextEditor';
import { getSuggestion } from '@/utils/copy-suggestions-helper';

interface FAQSectionEditorProps {
  section: WireframeSection;
  onUpdate: (updates: Partial<WireframeSection>) => void;
}

interface FAQItem {
  question: string;
  answer: string;
  id: string;
}

const FAQSectionEditor: React.FC<FAQSectionEditorProps> = ({ section, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('content');
  
  // Get data from section or use defaults
  const backgroundColor = section.backgroundColor || section.style?.backgroundColor || '#ffffff';
  const heading = section.data?.heading || getSuggestion(section.copySuggestions, 'heading', 'Frequently Asked Questions');
  const subheading = section.data?.subheading || getSuggestion(section.copySuggestions, 'subheading', 'Find answers to common questions about our products and services');
  
  // Initialize FAQ items
  const initialFaqs = section.data?.faqs || [];
  const [faqs, setFaqs] = useState<FAQItem[]>(initialFaqs);
  const layout = section.data?.layout || 'accordion';
  
  // Handle content updates
  const handleContentChange = (field: string, value: any) => {
    const updatedData = {
      ...(section.data || {}),
      [field]: value
    };
    onUpdate({ data: updatedData });
  };
  
  // Handle style updates
  const handleStyleChange = (field: string, value: any) => {
    const updatedStyle = {
      ...(section.style || {}),
      [field]: value
    };
    onUpdate({ style: updatedStyle, [field]: value });
  };
  
  // FAQ management
  const addFaq = () => {
    const newFaq = {
      id: `faq-${Date.now()}`,
      question: 'New Question',
      answer: 'Answer to the question.'
    };
    
    const updatedFaqs = [...faqs, newFaq];
    setFaqs(updatedFaqs);
    handleContentChange('faqs', updatedFaqs);
  };
  
  const updateFaq = (id: string, field: string, value: string) => {
    const updatedFaqs = faqs.map(faq => {
      if (faq.id === id) {
        return { ...faq, [field]: value };
      }
      return faq;
    });
    
    setFaqs(updatedFaqs);
    handleContentChange('faqs', updatedFaqs);
  };
  
  const deleteFaq = (id: string) => {
    const updatedFaqs = faqs.filter(faq => faq.id !== id);
    setFaqs(updatedFaqs);
    handleContentChange('faqs', updatedFaqs);
  };
  
  const moveFaq = (id: string, direction: 'up' | 'down') => {
    const index = faqs.findIndex(faq => faq.id === id);
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === faqs.length - 1)
    ) {
      return;
    }
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const updatedFaqs = [...faqs];
    const [removed] = updatedFaqs.splice(index, 1);
    updatedFaqs.splice(newIndex, 0, removed);
    
    setFaqs(updatedFaqs);
    handleContentChange('faqs', updatedFaqs);
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="faqs">FAQ Items</TabsTrigger>
          <TabsTrigger value="style">Style</TabsTrigger>
        </TabsList>
        
        <TabsContent value="content" className="space-y-4 pt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="heading">Heading</Label>
              <Input
                id="heading"
                value={heading}
                onChange={(e) => handleContentChange('heading', e.target.value)}
                placeholder="FAQ Section Heading"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subheading">Subheading</Label>
              <RichTextEditor
                id="subheading"
                value={subheading}
                onChange={(value) => handleContentChange('subheading', value)}
                minHeight="100px"
                placeholder="FAQ Section Subheading"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="layout">FAQ Layout</Label>
              <Select 
                value={layout} 
                onValueChange={(value) => handleContentChange('layout', value)}
              >
                <SelectTrigger id="layout">
                  <SelectValue placeholder="Accordion" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="accordion">Accordion</SelectItem>
                  <SelectItem value="cards">Cards</SelectItem>
                  <SelectItem value="simple">Simple List</SelectItem>
                  <SelectItem value="twoColumn">Two-Column</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="faqs" className="space-y-4 pt-4">
          <div className="space-y-4">
            <Button onClick={addFaq} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" /> Add FAQ Item
            </Button>
            
            <div className="space-y-4 mt-4">
              {faqs.length === 0 ? (
                <div className="text-center p-4 border border-dashed rounded-md text-muted-foreground">
                  No FAQ items. Click the button above to add one.
                </div>
              ) : (
                faqs.map((faq, index) => (
                  <Card key={faq.id} className="relative">
                    <CardContent className="pt-4 space-y-2">
                      <div className="space-y-2">
                        <Label htmlFor={`question-${faq.id}`}>Question {index + 1}</Label>
                        <Input
                          id={`question-${faq.id}`}
                          value={faq.question}
                          onChange={(e) => updateFaq(faq.id, 'question', e.target.value)}
                          placeholder="Enter the question"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`answer-${faq.id}`}>Answer</Label>
                        <RichTextEditor
                          id={`answer-${faq.id}`}
                          value={faq.answer}
                          onChange={(value) => updateFaq(faq.id, 'answer', value)}
                          minHeight="100px"
                          placeholder="Enter the answer"
                        />
                      </div>
                      
                      <div className="flex justify-between mt-2">
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => moveFaq(faq.id, 'up')}
                            disabled={index === 0}
                          >
                            <MoveUp className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => moveFaq(faq.id, 'down')}
                            disabled={index === faqs.length - 1}
                          >
                            <MoveDown className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button 
                          variant="destructive" 
                          size="icon" 
                          onClick={() => deleteFaq(faq.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="style" className="space-y-4 pt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="backgroundColor">Background Color</Label>
              <div className="flex items-center space-x-2">
                <ColorPicker
                  id="backgroundColor"
                  color={backgroundColor}
                  onChange={(color) => handleStyleChange('backgroundColor', color)}
                />
                <Input
                  value={backgroundColor}
                  onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                  className="w-32"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="padding">Padding</Label>
              <Select 
                value={section.style?.padding || section.padding || '6'} 
                onValueChange={(value) => handleStyleChange('padding', value)}
              >
                <SelectTrigger id="padding">
                  <SelectValue placeholder="Large (24px)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">None (0px)</SelectItem>
                  <SelectItem value="2">Small (8px)</SelectItem>
                  <SelectItem value="4">Medium (16px)</SelectItem>
                  <SelectItem value="6">Large (24px)</SelectItem>
                  <SelectItem value="8">Extra Large (32px)</SelectItem>
                  <SelectItem value="12">XXL (48px)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Additional style options could be added here */}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FAQSectionEditor;
