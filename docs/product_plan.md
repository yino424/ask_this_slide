# Product Plan

## MVP Goal

Help non-native students turn a current lecture slide or video frame into bilingual study notes that preserve standard English academic terminology.

## Target User

University students watching educational content in English, Chinese, Japanese, Korean, or mixed-language settings.

## Core Flow

1. Student opens the Chrome extension popup.
2. Student chooses source language, note language, and academic field.
3. Student clicks Analyze Current Frame.
4. Extension captures the visible tab as a screenshot.
5. Backend sends the screenshot and prompt to OpenAI.
6. Popup displays bilingual notes, key concepts, and terminology.

## In Scope

- Screenshot capture
- Local backend API
- OpenAI vision analysis
- Structured JSON response
- Bilingual study note UI
- Local MVP security and cost controls

## Out of Scope

- Audio recognition
- Speech-to-text
- Real-time subtitles
- Separate OCR pipeline
- Tesseract.js
- User accounts
- Database

## Next Useful Iterations

- Copy-to-clipboard button for notes
- User-editable backend URL
- Better extension icons
- Saved local history
- PDF/video-frame specific capture helpers
- Export to Markdown

## MVP Safety Plan

- Keep `OPENAI_API_KEY` only in the backend `.env`.
- Never expose the key to the extension.
- Do not store screenshots or analysis results.
- Compress screenshots before sending when possible.
- Reject oversized image payloads on the backend.
- Limit API usage with basic per-IP rate limiting.
- Keep OpenAI output concise.
- Restrict CORS for local development.
- Warn clearly before any public deployment.
