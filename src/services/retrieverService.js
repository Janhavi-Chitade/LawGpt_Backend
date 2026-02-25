import { ChromaClient } from "chromadb";
import { getEmbedding } from "./embedService.js";

const chroma = new ChromaClient({ path: "http://localhost:8000" });

export const retrieveDocs = async (question) => {
  console.log("Retrieving documents for question:", question);
  try {
    const embedding = await getEmbedding(question);

    if (!embedding) {
      throw new Error("Embedding failed");
    }

    const collection = await chroma.getCollection({
      name: "law_documents"  // ⚠ must match indexing name exactly
    });

    const results = await collection.query({
      queryEmbeddings: [embedding],
      nResults: 5
    });


  // console.log("Query results full:", JSON.stringify(results, null));

    const count = await collection.count();
console.log("Total documents in collection:", count);

    if (!results.documents || results.documents.length === 0) {
      return [];
    }

    return results.documents.map((doc, index) => ({
      text: doc,
      source: results.metadatas?.[index]?.source || "Unknown",
    }));

  } catch (error) {
    console.error("Retrieval error:", error);
    return [];
  }
};
