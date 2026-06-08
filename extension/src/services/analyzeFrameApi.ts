import type { AcademicField, NoteLanguage, SourceLanguage } from "../utils/options";

export type AnalyzeFrameResult = {
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

export async function analyzeFrame(params: {
  imageDataUrl: string;
  sourceLanguage: SourceLanguage;
  noteLanguage: NoteLanguage;
  academicField: AcademicField;
}): Promise<AnalyzeFrameResult> {
  let response: Response;

  try {
    response = await fetch("http://localhost:8787/api/analyze-frame", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(params)
    });
  } catch {
    throw new Error("Cannot reach the local backend. Start the backend server and try again.");
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message ?? "Backend request failed.");
  }

  return data as AnalyzeFrameResult;
}
