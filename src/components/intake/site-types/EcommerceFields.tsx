
import React, { useState, useEffect } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import BaseFields from "./BaseFields";
import { useAuth } from "@/hooks/use-auth";
import TooltipHelper from "../TooltipHelper";

interface EcommerceFieldsProps {
  form: UseFormReturn<any>;
  showTooltips?: boolean;
}

const EcommerceFields = ({ form, showTooltips = false }: EcommerceFieldsProps) => {
  const { profile } = useAuth();
  const isPro = profile?.role === 'pro';
  const [customQuestions, setCustomQuestions] = useState<string[]>([]);
  const [newQuestion, setNewQuestion] = useState('');

  const exampleAnswers = {
    estimatedProducts: "50-100 products with variations for size and color",
    paymentProcessors: "Stripe for credit cards, PayPal for alternative payments, and considering Apple Pay for mobile checkout"
  };

  // Restore custom questions from form data when component mounts
  useEffect(() => {
    const savedCustomQuestions = form.getValues('customQuestions');
    if (savedCustomQuestions && Array.isArray(savedCustomQuestions)) {
      setCustomQuestions(savedCustomQuestions);
    }
  }, [form]);

  const addCustomQuestion = () => {
    if (newQuestion.trim()) {
      setCustomQuestions([...customQuestions, newQuestion.trim()]);
      setNewQuestion('');
      
      // Update the form with the custom questions
      const currentCustomQuestions = form.getValues('customQuestions') || [];
      form.setValue('customQuestions', [...currentCustomQuestions, newQuestion.trim()]);
    }
  };

  const removeCustomQuestion = (index: number) => {
    const updatedQuestions = customQuestions.filter((_, i) => i !== index);
    setCustomQuestions(updatedQuestions);
    
    // Update the form with the updated list
    form.setValue('customQuestions', updatedQuestions);
  };

  return (
    <>
      <BaseFields form={form} showTooltips={showTooltips} />
      
      <FormField
        control={form.control}
        name="estimatedProducts"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center">
              <FormLabel>Estimated Products</FormLabel>
              {showTooltips && (
                <TooltipHelper 
                  content={<div className="font-normal italic text-xs">Example: {exampleAnswers.estimatedProducts}</div>} 
                />
              )}
            </div>
            <FormControl>
              <Input placeholder="How many products will you sell?" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="paymentProcessors"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center">
              <FormLabel>Payment Processors</FormLabel>
              {showTooltips && (
                <TooltipHelper 
                  content={<div className="font-normal italic text-xs">Example: {exampleAnswers.paymentProcessors}</div>} 
                />
              )}
            </div>
            <FormControl>
              <Input placeholder="e.g., Stripe, PayPal, Square" {...field} />
            </FormControl>
            <FormDescription>
              Which payment processors would you like to use?
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="shippingIntegration"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Shipping Integration</FormLabel>
              <FormDescription>
                Do you need real-time shipping calculations?
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={!!field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
      
      {isPro && (
        <div className="mt-8 border-t pt-6">
          <h3 className="text-base font-medium mb-4">Pro Feature: Custom Questions</h3>
          <FormDescription className="mb-4">
            Add your own custom questions to the questionnaire. These will be asked in addition to the AI-generated questions.
          </FormDescription>
          
          <div className="space-y-4">
            {customQuestions.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Your Custom Questions:</p>
                <ul className="space-y-2">
                  {customQuestions.map((question, index) => (
                    <li key={index} className="flex items-center justify-between rounded-md border p-3">
                      <span>{question}</span>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeCustomQuestion(index)}
                      >
                        <Trash2 className="h-4 w-4 text-gray-500" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="flex space-x-2">
              <Input
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="Enter a custom question here..."
                className="flex-1"
              />
              <Button 
                type="button" 
                onClick={addCustomQuestion}
                disabled={!newQuestion.trim()}
                size="sm"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EcommerceFields;
