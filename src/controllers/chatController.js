import { retrieveDocs } from "../services/retrieverService.js";
import { generateAnswer } from "../services/generatorService.js";


export const handleChat = async (req, res) => {
  try {
    const { question } = req.body;

    const retrievedDocs = await retrieveDocs(question);

    if (retrievedDocs.length === 0) {
      return res.json({
        answer: "The answer is not found in the indexed legal documents."
      });
    }

    const answer = await generateAnswer(question, retrievedDocs);
console.log("Answer:", answer,"question:", answer,"Answer:", answer)
    res.json({ answer });

  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({
      answer: "Server error occurred.",
      error: error.message
    });
  }
};
