import express from "express";
import { handleChat } from "../controllers/chatController.js";

const router = express.Router();

/**
 * @swagger
 * /api/chat:
 *   post:
 *     summary: Chat with the Law AI
 *     description: Send a question to the AI to get answers based on indexed law documents.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *                 example: "What is Section 10 of the Company Law?"
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 answer:
 *                   type: string
 *       400:
 *         description: Invalid input
 */
router.post("/", handleChat);

export default router;
