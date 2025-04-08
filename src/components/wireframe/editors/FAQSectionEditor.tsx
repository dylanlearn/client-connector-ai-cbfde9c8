
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import RichTextEditor from './RichTextEditor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { GripVertical, X, Plus } from 'lucide-react';

interface FAQSectionEditorProps {
  section: WireframeSection;
  onUpdate: (updates: Partial<WireframeSection>) => void;
}

const FAQSectionEditor: React.FC<FAQSectionEditorProps> = ({ section, onUpdate }) => {
  const data = section.data || {};
  const {
    title = 'Frequently Asked Questions',
    subtitle = '',
    faqs = [],
    faqType = 'accordion',
    backgroundStyle = 'light',
    alignment = 'center',
  } = data;

  const handleDataChange = (key: string, value: any) => {
    const updatedData = { ...(section.data || {}), [key]: value };
    onUpdate({ data: updatedData });
  };

  const handleFAQChange = (index: number, field: string, value: string) => {
    const updatedFAQs = [...faqs];
    updatedFAQs[index] = { ...updatedFAQs[index], [field]: value };
    handleDataChange('faqs', updatedFAQs);
  };

  const addNewFAQ = () => {
    const updatedFAQs = [...faqs, { question: 'New question?', answer: 'Answer goes here.' }];
    handleDataChange('faqs', updatedFAQs);
  };

  const removeFAQ = (index: number) => {
    const updatedFAQs = [...faqs];
    updatedFAQs.splice(index, 1);
    handleDataChange('faqs', updatedFAQs);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const reorderedFAQs = Array.from(faqs);
    const [removed] = reorderedFAQs.splice(result.source.index, 1);
    reorderedFAQs.splice(result.destination.index, 0, removed);
    
    handleDataChange('faqs', reorderedFAQs);
  };

  return (
    <Tabs defaultValue="content" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="content">Content</TabsTrigger>
        <TabsTrigger value="faqs">FAQ Items</TabsTrigger>
        <TabsTrigger value="style">Style & Layout</TabsTrigger>
      </TabsList>
      
      <TabsContent value="content" className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Section Title</Label>
          <Input 
            id="title" 
            value={title} 
            onChange={(e) => handleDataChange('title', e.target.value)} 
            placeholder="Enter section title"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="subtitle">Section Subtitle</Label>
          <RichTextEditor
            value={subtitle}
            onChange={(value) => handleDataChange('subtitle', value)}
            placeholder="Enter section subtitle"
            minHeight="100px"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="faqType">FAQ Display Type</Label>
          <Select 
            value={faqType} 
            onValueChange={(value) => handleDataChange('faqType', value)}
          >
            <SelectTrigger id="faqType">
              <SelectValue placeholder="Select display style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="accordion">Accordion</SelectItem>
              <SelectItem value="simple">Simple List</SelectItem>
              <SelectItem value="grid">Grid Layout</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </TabsContent>
      
      <TabsContent value="faqs" className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex justify-between items-center">
              <span>FAQ Items</span>
              <Button onClick={addNewFAQ} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="faqs-list">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-4"
                  >
                    {faqs.map((faq, index) => (
                      <Draggable key={`faq-${index}`} draggableId={`faq-${index}`} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="border rounded-md p-4 bg-background"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center">
                                <div
                                  {...provided.dragHandleProps}
                                  className="mr-2 cursor-grab hover:bg-muted p-1 rounded"
                                >
                                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <span className="font-medium">Question {index + 1}</span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFAQ(index)}
                                className="h-8 w-8 p-0 text-destructive"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            <div className="space-y-3">
                              <div className="space-y-1">
                                <Label htmlFor={`question-${index}`}>Question</Label>
                                <Input
                                  id={`question-${index}`}
                                  value={faq.question}
                                  onChange={(e) => handleFAQChange(index, 'question', e.target.value)}
                                  placeholder="Enter question"
                                />
                              </div>
                              
                              <div className="space-y-1">
                                <Label htmlFor={`answer-${index}`}>Answer</Label>
                                <RichTextEditor
                                  value={faq.answer}
                                  onChange={(value) => handleFAQChange(index, 'answer', value)}
                                  placeholder="Enter answer"
                                  minHeight="100px"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    
                    {faqs.length === 0 && (
                      <div className="text-center p-6 border border-dashed rounded-md">
                        <p className="text-muted-foreground">No FAQ items yet. Add your first question.</p>
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="style" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="backgroundStyle">Background Style</Label>
            <Select 
              value={backgroundStyle} 
              onValueChange={(value) => handleDataChange('backgroundStyle', value)}
            >
              <SelectTrigger id="backgroundStyle">
                <SelectValue placeholder="Select background style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="primary">Primary Color</SelectItem>
                <SelectItem value="muted">Muted</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="alignment">Content Alignment</Label>
            <Select 
              value={alignment} 
              onValueChange={(value) => handleDataChange('alignment', value)}
            >
              <SelectTrigger id="alignment">
                <SelectValue placeholder="Select alignment" />
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
    </Tabs>
  );
};

export default FAQSectionEditor;
