import { useState } from "react";
import { ResultView } from "../components/ResultView";
import { SelectField } from "../components/SelectField";
import { analyzeFrame, type AnalyzeFrameResult } from "../services/analyzeFrameApi";
import { captureVisibleTab } from "../services/chromeCapture";
import { compressScreenshot } from "../utils/compressScreenshot";
import {
  academicFieldOptions,
  noteLanguageOptions,
  sourceLanguageOptions,
  type AcademicField,
  type NoteLanguage,
  type SourceLanguage
} from "../utils/options";

export function PopupApp() {
  const [sourceLanguage, setSourceLanguage] = useState<SourceLanguage>("auto");
  const [noteLanguage, setNoteLanguage] = useState<NoteLanguage>("zh");
  const [academicField, setAcademicField] = useState<AcademicField>("auto");
  const [imageDataUrl, setImageDataUrl] = useState<string>("");
  const [result, setResult] = useState<AnalyzeFrameResult | null>(null);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleAnalyze() {
    setIsLoading(true);
    setError("");
    setResult(null);

    try {
      const screenshot = await captureVisibleTab();
      const compressedScreenshot = await compressScreenshot(screenshot);
      setImageDataUrl(compressedScreenshot);

      const analysis = await analyzeFrame({
        imageDataUrl: compressedScreenshot,
        sourceLanguage,
        noteLanguage,
        academicField
      });

      setResult(analysis);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleClear() {
    setImageDataUrl("");
    setResult(null);
    setError("");
  }

  return (
    <main className="popupShell">
      <header className="topBar">
        <div>
          <p className="eyebrow">Bilingual frame notes</p>
          <h1>Ask This Slide</h1>
        </div>
        <span className="statusDot" aria-label="Local MVP" />
      </header>

      <section className="controls">
        <SelectField
          label="Source Language"
          value={sourceLanguage}
          options={sourceLanguageOptions}
          onChange={setSourceLanguage}
        />
        <SelectField label="Note Language" value={noteLanguage} options={noteLanguageOptions} onChange={setNoteLanguage} />
        <SelectField
          label="Academic Field"
          value={academicField}
          options={academicFieldOptions}
          onChange={setAcademicField}
        />
      </section>

      <section className="actions">
        <button className="primaryButton" disabled={isLoading} onClick={handleAnalyze}>
          {isLoading ? "Analyzing..." : "Analyze Current Frame"}
        </button>
        <button className="secondaryButton" disabled={isLoading} onClick={handleClear}>
          Clear
        </button>
      </section>

      <section className="preview" aria-label="Screenshot preview">
        {imageDataUrl ? <img src={imageDataUrl} alt="Captured browser frame" /> : <p>Screenshot preview will appear here.</p>}
      </section>

      {isLoading && <div className="loading">Reading the frame and building bilingual notes...</div>}
      {error && <div className="error">{error}</div>}
      {result && <ResultView result={result} />}
    </main>
  );
}
