import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";
import { HindsightClient } from "@vectorize-io/hindsight-client";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const hindsight = new HindsightClient({
  baseUrl: process.env.HINDSIGHT_BASE_URL,
  apiKey: process.env.HINDSIGHT_API_KEY,
});

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const BANK_ID = "recallops-incidents";

app.get("/", (req, res) => {
  res.json({
    message: "RecallOps backend is running",
    status: "success",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "RecallOps API",
    hindsight: "configured",
    groq: "configured",
  });
});

app.post("/api/incidents/analyze", async (req, res) => {
  try {
    const { incident } = req.body;

    if (!incident) {
      return res.status(400).json({
        error: "Incident description is required.",
      });
    }

    console.log("New incident received:", incident);

    // 1. Search Hindsight for relevant past incidents
    const memoryResult = await hindsight.recall(
      BANK_ID,
      incident,
      {
        budget: "low",
      }
    );

    const memories = memoryResult.results || [];

    const memoryContext = memories.length
      ? memories
          .map(
            (memory, index) =>
              `Memory ${index + 1}:\n${memory.text}`
          )
          .join("\n\n")
      : "No relevant previous incidents were found.";

    // 2. Ask Groq to analyze the current incident
    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        {
          role: "system",
          content: `
You are RecallOps, an AI incident-response assistant for software engineering teams.

Analyze production incidents using the current incident and relevant historical incident memories.

Your response must contain:
1. Likely cause
2. Recommended investigation steps
3. Recommended action
4. Risk or uncertainty
5. Whether a previous incident appears relevant

Do not claim certainty when the evidence is insufficient.
Clearly distinguish historical information from your own recommendation.
          `,
        },
        {
          role: "user",
          content: `
CURRENT INCIDENT:
${incident}

RELEVANT HISTORICAL MEMORIES:
${memoryContext}
          `,
        },
      ],
    });

    const analysis = completion.choices[0]?.message?.content || "";

    res.json({
      incident,
      analysis,
      memoriesUsed: memories,
      memoryCount: memories.length,
    });
  } catch (error) {
    console.error("Incident analysis failed:", error);

    res.status(500).json({
      error: "Failed to analyze incident.",
      details: error.message,
    });
  }
});

app.post("/api/incidents/resolve", async (req, res) => {
  try {
    const { incident, rootCause, resolution, outcome } = req.body;

    if (!incident || !rootCause || !resolution) {
      return res.status(400).json({
        error: "Incident, rootCause, and resolution are required.",
      });
    }

    const memory = `
Production incident:
${incident}

Root cause:
${rootCause}

Resolution:
${resolution}

Outcome:
${outcome || "Not specified"}
`;

    await hindsight.retain(BANK_ID, memory);

    res.json({
      success: true,
      message: "Incident resolution stored in Hindsight.",
    });
  } catch (error) {
    console.error("Failed to store incident:", error);

    res.status(500).json({
      error: "Failed to store incident resolution.",
      details: error.message,
    });
  }
}); app.listen(PORT, () => {
  console.log(`RecallOps backend running on http://localhost:${PORT}`);
});