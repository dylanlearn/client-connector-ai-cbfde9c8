
// Create a questions utility to provide specific questions by site type
import { Question } from "@/components/intake/QuestionItem";

// Sample questions by site type
const questions: Record<string, Question[]> = {
  saas: [
    {
      id: "userAccountsRequired",
      question: "Will users need to create accounts?",
      type: "checkbox",
      required: false
    },
    {
      id: "pricingTiers",
      question: "Describe your pricing tiers",
      type: "textarea",
      required: false
    },
    {
      id: "freeTrialOffered",
      question: "Will you offer a free trial?",
      type: "checkbox",
      required: false
    },
    {
      id: "mainFeatures",
      question: "List your main features",
      type: "textarea",
      required: false
    }
  ],
  ecommerce: [
    {
      id: "estimatedProducts",
      question: "How many products do you plan to sell?",
      type: "text",
      required: false
    },
    {
      id: "paymentProcessors",
      question: "Which payment processors will you use?",
      type: "text",
      required: false
    },
    {
      id: "shippingIntegration",
      question: "Do you need shipping integration?",
      type: "checkbox",
      required: false
    }
  ],
  business: [
    {
      id: "serviceOfferings",
      question: "List your service offerings",
      type: "textarea",
      required: false
    },
    {
      id: "contactFormRequired",
      question: "Do you need a contact form?",
      type: "checkbox",
      required: false
    },
    {
      id: "hasPhysicalLocation",
      question: "Do you have a physical location?",
      type: "checkbox",
      required: false
    }
  ],
  portfolio: [
    {
      id: "projectCategories",
      question: "What categories of work do you want to showcase?",
      type: "textarea",
      required: false
    },
    {
      id: "contactInformation",
      question: "What contact information will you include?",
      type: "textarea",
      required: false
    },
    {
      id: "resumeUploadRequired",
      question: "Do you want to include a downloadable resume?",
      type: "checkbox",
      required: false
    }
  ]
};

// Default questions for any site type
const defaultQuestions: Question[] = [
  {
    id: "mainFeatures",
    question: "What are the main features you want to highlight?",
    type: "textarea",
    required: false
  },
  {
    id: "competitors",
    question: "Who are your main competitors?",
    type: "textarea",
    required: false
  }
];

export const getQuestionsBySiteType = (siteType: string | undefined): Question[] => {
  if (!siteType) return defaultQuestions;
  return questions[siteType] || defaultQuestions;
};
