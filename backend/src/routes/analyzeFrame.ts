import { Router } from "express";
import { z } from "zod";
import { analyzeFrame } from "../services/openaiVisionService.js";

const maxImageDataUrlLength = Number(process.env.MAX_IMAGE_DATA_URL_LENGTH ?? 6_000_000);

const analyzeFrameSchema = z.object({
  imageDataUrl: z
    .string()
    .startsWith("data:image/")
    .max(maxImageDataUrlLength)
    .refine((value) => /^data:image\/(png|jpeg|jpg|webp);base64,[A-Za-z0-9+/=]+$/.test(value), {
      message: "imageDataUrl must be a PNG, JPEG, or WebP base64 data URL."
    }),
  sourceLanguage: z.enum(["auto", "en", "zh", "ja", "ko"]).default("auto"),
  noteLanguage: z.enum(["zh", "en", "ja"]).default("zh"),
  academicField: z
    .enum([
      "auto",
      "computer_science",
      "machine_learning",
      "mathematics",
      "engineering",
      "architecture",
      "urban_studies"
    ])
    .default("auto")
});

export const analyzeFrameRouter = Router();

analyzeFrameRouter.post("/analyze-frame", async (req, res) => {
  const parsed = analyzeFrameSchema.safeParse(req.body);

  if (!parsed.success) {
    const imageTooLarge = parsed.error.issues.some(
      (issue) => issue.path.join(".") === "imageDataUrl" && issue.code === "too_big"
    );

    if (imageTooLarge) {
      return res.status(413).json({
        error: "Image too large",
        message: "The screenshot is too large to analyze. Try a smaller browser window or lower zoom level."
      });
    }

    return res.status(400).json({
      error: "Invalid request body",
      message: "The screenshot request is invalid. Please capture the frame again.",
      details: parsed.error.flatten()
    });
  }

  try {
    const result = await analyzeFrame(parsed.data);
    return res.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const isMissingApiKey = message.includes("OPENAI_API_KEY");

    return res.status(500).json({
      error: isMissingApiKey ? "API key missing" : "Failed to analyze frame",
      message: isMissingApiKey
        ? "The backend is missing OPENAI_API_KEY. Add it to backend/.env and restart the server."
        : "OpenAI could not analyze this frame right now. Please try again in a moment."
    });
  }
});
