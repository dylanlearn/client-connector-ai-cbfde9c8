
export const generateFollowUp = (questionId: string, answer: string): string | null => {
  if (!answer || answer.length > 50) return null;
  
  // Simple content-based follow-ups
  if (questionId === "q1") {
    if (answer.toLowerCase().includes("ecommerce") || answer.toLowerCase().includes("shop")) {
      return "Could you specify what kind of products you'll be selling and if you have any specific requirements for the shopping experience?";
    }
    return "Could you elaborate on the specific functions or features your website should have to fulfill this purpose?";
  } 
  
  if (questionId === "q2") {
    if (answer.toLowerCase().includes("everyone") || answer.toLowerCase().includes("all")) {
      return "Targeting everyone often means reaching no one effectively. Could you specify the primary demographics or user groups that would most benefit from your product/service?";
    }
    return "What are the specific needs or pain points of this target audience that your website should address?";
  }
  
  if (questionId === "q3") {
    return "Which of these goals would you consider your top priority, and how would you measure success?";
  }
  
  if (questionId === "q4") {
    return "For these websites you like, are there specific sections or features that you particularly want to emulate?";
  }
  
  return null;
};
