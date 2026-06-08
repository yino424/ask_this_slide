import OpenAI from "openai";
import { buildAnalyzeFramePrompt, type AnalyzeFramePromptOptions } from "../prompts/analyzeFramePrompt.js";

export type AnalyzeFrameRequest = AnalyzeFramePromptOptions & {
  imageDataUrl: string;
};

export type AnalyzeFrameResponse = {
  detectedLanguage: string;
  slideSummary: string;
  teacherExplanation: string;
  bilingualNotes: string;
  keyConcepts: Array<{
    originalConcept: string;
    englishTerm: string;
    chineseExplanation: string;
    simpleExample: string;
  }>;
  terminologyTable: Array<{
    originalText: string;
    standardEnglishTerm: string;
    chineseMeaning: string;
    whyItMatters: string;
  }>;
  copyableStudyNotes: string;
};

const analyzeFrameResponseSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    detectedLanguage: { type: "string" },
    slideSummary: { type: "string" },
    teacherExplanation: { type: "string" },
    bilingualNotes: { type: "string" },
    keyConcepts: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          originalConcept: { type: "string" },
          englishTerm: { type: "string" },
          chineseExplanation: { type: "string" },
          simpleExample: { type: "string" }
        },
        required: ["originalConcept", "englishTerm", "chineseExplanation", "simpleExample"]
      }
    },
    terminologyTable: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          originalText: { type: "string" },
          standardEnglishTerm: { type: "string" },
          chineseMeaning: { type: "string" },
          whyItMatters: { type: "string" }
        },
        required: ["originalText", "standardEnglishTerm", "chineseMeaning", "whyItMatters"]
      }
    },
    copyableStudyNotes: { type: "string" }
  },
  required: [
    "detectedLanguage",
    "slideSummary",
    "teacherExplanation",
    "bilingualNotes",
    "keyConcepts",
    "terminologyTable",
    "copyableStudyNotes"
  ]
} as const;

export async function analyzeFrame(request: AnalyzeFrameRequest): Promise<AnalyzeFrameResponse> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured. Add it to backend/.env.");
  }

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  const prompt = buildAnalyzeFramePrompt(request);
  const model = process.env.OPENAI_MODEL ?? "gpt-4.1-mini";

  let response: Awaited<ReturnType<typeof client.responses.create>>;

  try {
    response = await client.responses.create({
      model,
      max_output_tokens: 1400,
      input: [
        {
          role: "user",
          content: [
            { type: "input_text", text: prompt },
            { type: "input_image", image_url: request.imageDataUrl, detail: "auto" }
          ]
        }
      ],
      text: {
        format: {
          type: "json_schema",
          name: "ask_this_slide_analysis",
          strict: true,
          schema: analyzeFrameResponseSchema
        }
      }
    });
  } catch (error) {
    throw new Error(`OpenAI: ${getOpenAiFriendlyMessage(error)}`);
  }

  const rawText = response.output_text;

  if (!rawText) {
    throw new Error("OpenAI returned an empty response.");
  }

  try {
    return JSON.parse(rawText) as AnalyzeFrameResponse;
  } catch {
    throw new Error("OpenAI returned invalid JSON.");
  }
}

function getOpenAiFriendlyMessage(error: unknown): string {
  const status = typeof error === "object" && error !== null && "status" in error ? Number(error.status) : 0;
  const code = typeof error === "object" && error !== null && "code" in error ? String(error.code) : "";

  if (status === 401) {
    return "Your OpenAI API key was rejected. Check backend/.env, save it, and restart the backend.";
  }

  if (status === 403) {
    return "Your OpenAI account does not have access to this model or request. Try changing OPENAI_MODEL in backend/.env.";
  }

  if (status === 429 || code === "rate_limit_exceeded") {
    return "OpenAI rate limit or quota was reached. Please wait, check billing/quota, or try a smaller frame.";
  }

  if (status === 400) {
    return "OpenAI could not read this image request. Try a cleaner frame, smaller browser window, or different model.";
  }

  return "OpenAI could not analyze this frame right now. Please try again in a moment.";
}
