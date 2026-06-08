export const sourceLanguageOptions = [
  { label: "Auto", value: "auto" },
  { label: "English", value: "en" },
  { label: "Chinese", value: "zh" },
  { label: "Japanese", value: "ja" },
  { label: "Korean", value: "ko" }
] as const;

export const noteLanguageOptions = [
  { label: "Chinese", value: "zh" },
  { label: "English", value: "en" },
  { label: "Japanese", value: "ja" }
] as const;

export const academicFieldOptions = [
  { label: "Auto", value: "auto" },
  { label: "Computer Science", value: "computer_science" },
  { label: "AI / Machine Learning", value: "machine_learning" },
  { label: "Mathematics", value: "mathematics" },
  { label: "Engineering", value: "engineering" },
  { label: "Architecture", value: "architecture" },
  { label: "Urban Studies", value: "urban_studies" }
] as const;

export type SourceLanguage = (typeof sourceLanguageOptions)[number]["value"];
export type NoteLanguage = (typeof noteLanguageOptions)[number]["value"];
export type AcademicField = (typeof academicFieldOptions)[number]["value"];

