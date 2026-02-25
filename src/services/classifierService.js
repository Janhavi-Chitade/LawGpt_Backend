export const classifyQuestion = async (question) => {
  // Simple mock implementation
  // In a real app, this might use an LLM to check if the question is law-related
  const lawKeywords = ["law", "legal", "court", "act", "section", "article", "constitution", "rights", "duty"];
  const isLawRelated = lawKeywords.some(keyword => question.toLowerCase().includes(keyword));
  
  // For now, let's just return true to allow testing
  return true;
};
