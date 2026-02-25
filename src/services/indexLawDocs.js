import fs from "fs";
import path from "path";
import pdf from "pdf-parse";
import { getEmbedding } from "../services/embedService.js";
import { ChromaClient } from "chromadb";
import { chunkText } from "../utils/chunker.js";


// Chroma connection (Docker container)
const chroma = new ChromaClient({
  path: "http://localhost:8000"
});



const COLLECTION_NAME = "law_documents";
const LAWS_DIR = path.join(process.cwd(), "src/laws");




// ---- MAIN INDEXING FUNCTION ----
async function indexLawDocuments() {
  console.log("📚 Starting Law Document Indexing...");

  // Get or create collection
  const collection = await chroma.getOrCreateCollection({
    name: COLLECTION_NAME
  });

  const files = fs.readdirSync(LAWS_DIR).filter(f => f.endsWith(".pdf"));

  if (files.length === 0) {
    console.log("❌ No PDF files found in laws folder.");
    return;
  }

  for (const file of files) {
    console.log(`\n📄 Processing: ${file}`);

    const filePath = path.join(LAWS_DIR, file);
    const dataBuffer = fs.readFileSync(filePath);

    const pdfData = await pdf(dataBuffer);
    const text = pdfData.text.replace(/\n+/g, " ").trim();

    if (!text) {
      console.log(`⚠️ Skipped empty PDF: ${file}`);
      continue;
    }

    const chunks = chunkText(text);

    console.log(`🔹 Created ${chunks.length} chunks`);

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];

      const embedding = await getEmbedding(chunk);

      if (!embedding) {
        console.log(`⚠️ Skipping failed embedding at chunk: ${i}`);
        continue;
      }

      await collection.add({
        ids: [`${file}_chunk_${i}`],
        documents: [chunk],
        embeddings: [embedding],
        metadatas: [
          {
            source: file,
            chunk_index: i
          }
        ]
      });

      if (i % 10 === 0) {
        console.log(`   ⏳ Indexed chunk ${i + 1}/${chunks.length}`);
      }
    }

    console.log(`✅ Finished indexing ${file}`);
  }

  console.log("\n🎉 All law documents indexed successfully!");
}

// ---- RUN SCRIPT ----
indexLawDocuments().catch(err => {
  console.error("❌ Indexing failed:", err);
});
