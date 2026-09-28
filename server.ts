import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));

// Initialize Gemini Client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// API Routes
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", app: "EquiLink Communication Hub" });
});

// AI Trend Analysis API
app.post("/api/ai/analyze-trends", async (req, res) => {
  try {
    const { studentName, logs, schedule, sleepLogs } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(500).json({
        error: "Gemini API Key is missing. Please configure GEMINI_API_KEY in secrets.",
      });
    }

    const prompt = `You are an expert neurodiversity and autism behavioral specialist for the EquiLink Communication Hub.
Analyze the following student tracking data for ${studentName || "the student"}:

Recent Status Logs (Mood, Energy, Sensory Levels, Context):
${JSON.stringify(logs, null, 2)}

School Schedule & Activity Changes:
${JSON.stringify(schedule, null, 2)}

Recent Home Sleep Logs:
${JSON.stringify(sleepLogs, null, 2)}

Provide a structured analysis in JSON format with the following keys:
1. "primaryPatterns": array of 2-3 key observations/correlations (e.g., "Anxiety spikes on Tuesdays at 10:00 AM due to Gym noise level").
2. "sleepCorrelation": string explaining how home sleep duration impacts classroom sensory thresholds and mood.
3. "sensoryTriggers": array of identified environmental or schedule triggers.
4. "recommendedAccommodations": array of 3 actionable IEP / classroom / home accommodations.
5. "summaryNote": an encouraging 2-sentence summary for parents and teachers.

Return ONLY valid JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const resultText = response.text || "{}";
    const resultJson = JSON.parse(resultText);

    res.json({ success: true, analysis: resultJson });
  } catch (err: any) {
    console.error("Error analyzing trends:", err);
    res.status(500).json({ error: err.message || "Failed to analyze trend data" });
  }
});

// AI Decompression Advice API
app.post("/api/ai/decompression-advice", async (req, res) => {
  try {
    const { incidentTitle, incidentDetails, timeLogged, loggedByRole, sensoryLevel } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(500).json({
        error: "Gemini API Key missing",
      });
    }

    const prompt = `You are an autism transition and decompression specialist for EquiLink.
An incident occurred at school/home:
Incident Title: ${incidentTitle}
Details: ${incidentDetails}
Time Logged: ${timeLogged}
Sensory Level recorded: ${sensoryLevel}
Logged by: ${loggedByRole}

Generate 3 immediate, comforting, sensory-friendly decompression strategies for when the student transitions home or into a safe space.
Format as JSON:
{
  "summary": "Short 1-sentence overview of impact",
  "strategies": [
    {
      "title": "Strategy name",
      "action": "Clear step-by-step action (e.g., 15 mins dim lights + weighted lap pad + calm music)",
      "targetSensory": "Auditory / Proprioceptive / Visual / Tactile"
    }
  ],
  "noteForParent": "Gentle suggestion on how to greet the child without overwhelming them with questions."
}
Return ONLY valid JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const resultText = response.text || "{}";
    const resultJson = JSON.parse(resultText);

    res.json({ success: true, decompression: resultJson });
  } catch (err: any) {
    console.error("Error generating decompression advice:", err);
    res.status(500).json({ error: err.message || "Failed to generate decompression advice" });
  }
});

// AI Q&A Assistant API
app.post("/api/ai/ask-assistant", async (req, res) => {
  try {
    const { question, studentContext, role } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(500).json({
        error: "Gemini API key missing",
      });
    }

    const prompt = `You are EquiLink's AI Autism Specialist Assistant speaking with a ${role} regarding student ${studentContext?.name || "Leo"}.
Context:
- Grade/Age: ${studentContext?.age || "8 years old, 3rd Grade"}
- Key Traits: Sensory sensitive to loud noises, thrives on visual schedules, needs predictable transitions.

User Question: "${question}"

Provide a warm, supportive, practical, and evidence-based response tailored for a ${role}. Keep the tone constructive, empathetic, and actionable. Use bullet points where appropriate.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    res.json({ success: true, answer: response.text });
  } catch (err: any) {
    console.error("Error in AI Q&A:", err);
    res.status(500).json({ error: err.message || "Failed to answer query" });
  }
});

// Vite Middleware setup for dev vs production static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[EquiLink] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
