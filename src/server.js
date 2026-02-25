import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import chatRoutes from "./routes/chatRoutes.js";
import { setupSwagger } from "./config/swagger.js";

const app = express();

// console.log("GROQ_API_KEY ", process.env.GROQ_API_KEY);

app.use(cors({
  origin: [process.env.CORS_URL || "http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));
app.use(express.json());

// Swagger Documentation
setupSwagger(app);




app.use("/api/chat", chatRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
