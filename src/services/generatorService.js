export const generateAnswer = async (question, retrievedDocs) => {
  const context = retrievedDocs
    .map(doc => doc.text)
    .join("\n\n")
    .substring(0, 6000); // Hard cap

  const prompt = `
You are a professional legal assistant.

Answer ONLY using the provided legal context.

If answer is found:
Format response strictly as:

Answer:
<clear explanation>

Source:
<Mention section number, act name, or relevant heading from context>

If answer is NOT found, respond:
"The answer is not found in the indexed legal documents."

if question is greeting respond with a greeting:
"Hello! I am a legal assistant. How can I help you?"


Context:
${context}

Question:
${question}
`;

  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3.2", 
        prompt: prompt,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error("Ollama Generation error:", error);
    return "Error generating answer from local model.";
  }
};

