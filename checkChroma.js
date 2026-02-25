import { ChromaClient } from "chromadb";
const chroma = new ChromaClient({ path: "http://localhost:8000" });

async function check() {
  try {
    const collections = await chroma.listCollections();
    console.log("Collections:", collections);
    
    const collection = await chroma.getCollection({ name: "law_documents" });
    const count = await collection.count();
    console.log("Documents in 'law_documents':", count);
  } catch (err) {
    console.error("Error checking Chroma:", err.message);
  }
}

check();
