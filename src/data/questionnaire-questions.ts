
export interface QuestionItem {
  id: string;
  question: string;
  type: string;
  required: boolean;
}

export const questions: QuestionItem[] = [
  {
    id: "q1",
    question: "What is the main purpose of your website?",
    type: "text",
    required: true,
  },
  {
    id: "q2",
    question: "Who is your target audience?",
    type: "text",
    required: true,
  },
  {
    id: "q3",
    question: "What are the main goals you want to achieve with this website?",
    type: "text",
    required: true,
  },
  {
    id: "q4",
    question: "List 3-5 websites that you like the style of and explain why.",
    type: "text",
    required: true,
  },
  {
    id: "q5",
    question: "What are your brand colors? Please provide hex codes if available.",
    type: "text",
    required: false,
  },
];
