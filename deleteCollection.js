import { ChromaClient } from "chromadb";

const client = new ChromaClient({
  path: "http://localhost:8000",
});

async function deleteCollection() {
  await client.deleteCollection({
    name: "law_documents",
  });

  console.log("Collection deleted successfully");
}

deleteCollection();
