
import { useState, useCallback } from "react";
import { IntakeFormData } from "@/types/intake-form";

// Mock implementation of useIntakeForm hook
export const useIntakeForm = () => {
  const [intakeData, setIntakeData] = useState<IntakeFormData>({});
  
  const getSpecificQuestionsByType = useCallback(() => {
    // Mock questions based on site type
    const siteType = intakeData.siteType || 'business';
    
    const questionsByType: Record<string, any[]> = {
      'business': [
        { id: 'services', question: 'What services does your business offer?', type: 'textarea', required: true },
        { id: 'location', question: 'Does your business have physical locations?', type: 'checkbox', required: false }
      ],
      'ecommerce': [
        { id: 'products', question: 'How many products will you be selling?', type: 'text', required: true },
        { id: 'shipping', question: 'Do you need shipping integration?', type: 'checkbox', required: true }
      ],
      'portfolio': [
        { id: 'projects', question: 'What types of projects do you want to showcase?', type: 'textarea', required: true }
      ],
      'saas': [
        { id: 'features', question: 'What are the key features of your software?', type: 'textarea', required: true },
        { id: 'pricing', question: 'Do you have different pricing tiers?', type: 'checkbox', required: false }
      ]
    };
    
    return questionsByType[siteType] || [];
  }, [intakeData.siteType]);
  
  const updateFormData = useCallback((newData: Partial<IntakeFormData>) => {
    const updatedData = { ...intakeData, ...newData };
    setIntakeData(updatedData);
    return updatedData;
  }, [intakeData]);
  
  return {
    formData: intakeData,
    intakeData,
    getSpecificQuestionsByType,
    updateFormData
  };
};

export default useIntakeForm;
