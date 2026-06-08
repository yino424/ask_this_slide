import type { AnalyzeFrameResult } from "../services/analyzeFrameApi";

type ResultViewProps = {
  result: AnalyzeFrameResult;
};

export function ResultView({ result }: ResultViewProps) {
  return (
    <section className="result">
      <div className="resultHeader">
        <span>Detected</span>
        <strong>{result.detectedLanguage}</strong>
      </div>

      <article>
        <h2>Summary</h2>
        <p>{result.slideSummary}</p>
      </article>

      <article>
        <h2>Teacher Explanation</h2>
        <p>{result.teacherExplanation}</p>
      </article>

      <article>
        <h2>Bilingual Notes</h2>
        <p className="preserve">{result.bilingualNotes}</p>
      </article>

      <article>
        <h2>Key Concepts</h2>
        <div className="conceptList">
          {result.keyConcepts.map((concept, index) => (
            <div className="concept" key={`${concept.englishTerm}-${index}`}>
              <strong>{concept.englishTerm}</strong>
              <span>{concept.originalConcept}</span>
              <p>{concept.chineseExplanation}</p>
              <small>{concept.simpleExample}</small>
            </div>
          ))}
        </div>
      </article>

      <article>
        <h2>Terminology</h2>
        <div className="termTable">
          {result.terminologyTable.map((term, index) => (
            <div className="termRow" key={`${term.standardEnglishTerm}-${index}`}>
              <span>{term.originalText}</span>
              <strong>{term.standardEnglishTerm}</strong>
              <p>{term.chineseMeaning}</p>
              <small>{term.whyItMatters}</small>
            </div>
          ))}
        </div>
      </article>

      <article>
        <h2>Copyable Study Notes</h2>
        <pre>{result.copyableStudyNotes}</pre>
      </article>
    </section>
  );
}

