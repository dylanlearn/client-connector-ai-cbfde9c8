
import { useState, useCallback } from "react";
import { IntakeFormData } from "@/types/intake-form";

// Updated hook implementation
export const useIntakeForm = () => {
  const [intakeData, setIntakeData] = useState<IntakeFormData>({});
  
  const getSpecificQuestionsByType = useCallback(() => {
    // Mock questions based on site type
    const siteType = intakeData.siteType || 'business';
    
    const questionsByType: Record<string, any[]> = {
      'business': [
        { id: 'services', question: 'What services does your business offer?', type: 'textarea', required: true },
        { id: 'location', question: 'Does your business have physical locations?', type: 'checkbox', required: false },
        { id: 'projectName', question: 'What is your project name?', type: 'text', required: true },
        { id: 'projectDescription', question: 'Describe your project', type: 'textarea', required: true },
      ],
      'ecommerce': [
        { id: 'products', question: 'How many products will you be selling?', type: 'text', required: true },
        { id: 'shipping', question: 'Do you need shipping integration?', type: 'checkbox', required: true },
        { id: 'projectName', question: 'What is your project name?', type: 'text', required: true },
        { id: 'projectDescription', question: 'Describe your project', type: 'textarea', required: true },
      ],
      'portfolio': [
        { id: 'projects', question: 'What types of projects do you want to showcase?', type: 'textarea', required: true },
        { id: 'projectName', question: 'What is your project name?', type: 'text', required: true },
        { id: 'projectDescription', question: 'Describe your project', type: 'textarea', required: true },
      ],
      'saas': [
        { id: 'features', question: 'What are the key features of your software?', type: 'textarea', required: true },
        { id: 'pricing', question: 'Do you have different pricing tiers?', type: 'checkbox', required: false },
        { id: 'projectName', question: 'What is your project name?', type: 'text', required: true },
        { id: 'projectDescription', question: 'Describe your project', type: 'textarea', required: true },
      ]
    };
    
    return questionsByType[siteType] || [];
  }, [intakeData.siteType]);
  
  const updateFormData = useCallback((newData: Partial<IntakeFormData>) => {
    const updatedData = { ...intakeData, ...newData };
    setIntakeData(updatedData);
    return updatedData;
  }, [intakeData]);

  const hasInProgressForm = useCallback(() => {
    return Object.keys(intakeData).length > 0;
  }, [intakeData]);
  
  return {
    formData: intakeData,
    intakeData,
    getSpecificQuestionsByType,
    updateFormData,
    hasInProgressForm
  };
};

export default useIntakeForm;
