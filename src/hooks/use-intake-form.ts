
import { useState, useCallback } from "react";
import { IntakeFormData } from "@/types/intake-form";
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from "uuid";

// Updated hook implementation
export const useIntakeForm = () => {
  const [intakeData, setIntakeData] = useState<IntakeFormData>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formId] = useState<string>(uuidv4());
  const { toast } = useToast();
  
  const getSpecificQuestionsByType = useCallback(() => {
    // Mock questions based on site type
    const siteType = intakeData.siteType || 'business';
    
    const questionsByType: Record<string, any[]> = {
      'business': [
        { id: 'businessName', question: 'What is your business name?', type: 'text', required: true },
        { id: 'businessDescription', question: 'Describe your business', type: 'textarea', required: true },
        { id: 'serviceOfferings', question: 'What services does your business offer?', type: 'textarea', required: true },
        { id: 'hasPhysicalLocation', question: 'Does your business have physical locations?', type: 'checkbox', required: false },
        { id: 'contactFormRequired', question: 'Do you need a contact form?', type: 'checkbox', required: false },
      ],
      'ecommerce': [
        { id: 'businessName', question: 'What is your store name?', type: 'text', required: true },
        { id: 'businessDescription', question: 'Describe your online store', type: 'textarea', required: true },
        { id: 'estimatedProducts', question: 'How many products will you be selling?', type: 'text', required: true },
        { id: 'shippingIntegration', question: 'Do you need shipping integration?', type: 'checkbox', required: true },
        { id: 'paymentProcessors', question: 'What payment processors do you plan to use?', type: 'text', required: true },
      ],
      'portfolio': [
        { id: 'businessName', question: 'What is your name/brand?', type: 'text', required: true },
        { id: 'businessDescription', question: 'Tell us about yourself', type: 'textarea', required: true },
        { id: 'projectCategories', question: 'What types of projects do you want to showcase?', type: 'textarea', required: true },
        { id: 'contactInformation', question: 'How should people contact you?', type: 'text', required: true },
        { id: 'resumeUploadRequired', question: 'Do you want to include a resume?', type: 'checkbox', required: false },
      ],
      'saas': [
        { id: 'businessName', question: 'What is your software product name?', type: 'text', required: true },
        { id: 'businessDescription', question: 'Describe your software product', type: 'textarea', required: true },
        { id: 'mainFeatures', question: 'What are the key features of your software?', type: 'textarea', required: true },
        { id: 'userAccountsRequired', question: 'Will users need accounts?', type: 'checkbox', required: true },
        { id: 'pricingTiers', question: 'What pricing tiers will you offer?', type: 'textarea', required: false },
        { id: 'freeTrialOffered', question: 'Do you offer a free trial?', type: 'checkbox', required: false },
      ]
    };
    
    return questionsByType[siteType] || [];
  }, [intakeData.siteType]);
  
  const updateFormData = useCallback((newData: Partial<IntakeFormData>) => {
    setIsSaving(true);
    
    try {
      const updatedData = { ...intakeData, ...newData, lastUpdated: new Date().toISOString() };
      setIntakeData(updatedData);
      
      // Simulate saving to backend
      const savedData = { ...updatedData };
      
      // Save to localStorage as a fallback
      localStorage.setItem(`intake_form_${formId}`, JSON.stringify(savedData));
      
      return savedData;
    } catch (error) {
      console.error("Error updating form data:", error);
      toast({
        title: "Error saving data",
        description: "There was an issue saving your form data",
        variant: "destructive"
      });
      return intakeData;
    } finally {
      setIsSaving(false);
    }
  }, [intakeData, formId, toast]);

  const hasInProgressForm = useCallback(() => {
    return Object.keys(intakeData).length > 0;
  }, [intakeData]);
  
  const saveCurrentStep = useCallback((step: number) => {
    setCurrentStep(step);
    localStorage.setItem(`intake_form_step_${formId}`, step.toString());
  }, [formId]);
  
  const getSavedStep = useCallback(() => {
    const savedStep = localStorage.getItem(`intake_form_step_${formId}`);
    return savedStep ? parseInt(savedStep) : 1;
  }, [formId]);
  
  const clearFormData = useCallback(() => {
    setIntakeData({});
    localStorage.removeItem(`intake_form_${formId}`);
    localStorage.removeItem(`intake_form_step_${formId}`);
  }, [formId]);
  
  const submitForm = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // In a real app, you'd submit to backend here
      const submissionData = {
        ...intakeData,
        status: 'submitted',
        submittedAt: new Date().toISOString()
      };
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local data with submitted status
      setIntakeData(submissionData);
      
      toast({
        title: "Form submitted",
        description: "Your intake form was successfully submitted"
      });
      
      return submissionData;
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Submission failed",
        description: "There was an issue submitting your form",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [intakeData, toast]);
  
  const hasStartedForm = useCallback(() => {
    return localStorage.getItem(`intake_form_${formId}`) !== null;
  }, [formId]);
  
  return {
    formData: intakeData,
    intakeData,
    updateFormData,
    hasInProgressForm,
    isLoading,
    isSaving,
    saveCurrentStep,
    getSavedStep,
    clearFormData,
    submitForm,
    hasStartedForm,
    formId,
    getSpecificQuestionsByType
  };
};

export default useIntakeForm;
