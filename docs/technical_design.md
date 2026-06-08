# Technical Design

## Architecture

```text
Chrome popup
  -> chrome.tabs.captureVisibleTab
  -> client-side screenshot compression
  -> data:image/png;base64 screenshot
  -> POST http://localhost:8787/api/analyze-frame
  -> rate limit and request-size checks
  -> Express route validation
  -> OpenAI Responses API
  -> structured JSON
  -> popup result view
```

## Extension

- Manifest V3
- React + Vite + TypeScript
- Uses `activeTab` and `tabs` permissions
- Calls the local backend only
- Does not receive or store the OpenAI API key
- Compresses/resizes screenshots before upload when possible

## Backend

- Node.js + Express + TypeScript
- `POST /api/analyze-frame`
- Validates request body with Zod
- Uses the official OpenAI Node.js SDK
- Loads `OPENAI_API_KEY` from `.env`
- Rejects oversized payloads
- Rate limits requests to reduce accidental API spend
- Does not log screenshots or API keys
- Restricts CORS to local development origins

## Prompting

The prompt lives in `backend/src/prompts/analyzeFramePrompt.ts`.

It instructs the model to:

- Detect the visible educational content
- Infer the teacher's likely explanation
- Preserve English academic terms
- Map local-language concepts to standard English terminology
- Return JSON that follows the backend response schema

## Data Contract

The backend response includes:

- `detectedLanguage`
- `slideSummary`
- `teacherExplanation`
- `bilingualNotes`
- `keyConcepts`
- `terminologyTable`
- `copyableStudyNotes`
