// Native fetch is available in Node 18+


export const getEmbedding = async (text) => {
  try {
    const response = await fetch("http://localhost:11434/api/embeddings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "nomic-embed-text",
        prompt: text.substring(0, 4000)
      })
    });

    const data = await response.json();

    if (!data.embedding) {
      throw new Error("Embedding failed");
    }

    return data.embedding;

  } catch (err) {
    console.error("Embedding error:", err.message);
    return null;
  }
};
