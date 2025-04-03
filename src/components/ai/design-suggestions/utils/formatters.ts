
/**
 * Format AI suggestion content for better readability
 */
export const formatSuggestionContent = (text: string): string => {
  if (!text) return "";
  
  // Replace markdown-style headers with styled HTML
  let formattedText = text;
  
  // Replace ### headers with bullet points
  formattedText = formattedText.replace(/###\s?/g, "• ");
  
  // Convert headers to bold with larger text
  formattedText = formattedText.replace(
    /^(#+)\s+(.+)$/gm, 
    (_, hashes, content) => {
      // Determine heading level (h1, h2, etc.)
      const level = hashes.length;
      const fontSize = level === 1 ? "text-xl font-bold" : "text-lg font-semibold";
      return `<div class="${fontSize} my-3">${content}</div>`;
    }
  );
  
  // Preserve bullet points
  formattedText = formattedText.replace(
    /^[-*]\s+(.+)$/gm,
    (_, content) => `<div class="flex"><span class="mr-2">•</span><span>${content}</span></div>`
  );
  
  // Convert double newlines to <br> tags for better spacing
  formattedText = formattedText.replace(/\n\n/g, '<br><br>');
  
  // Convert remaining single newlines to <br> tags
  formattedText = formattedText.replace(/\n/g, '<br>');
  
  return formattedText;
};
