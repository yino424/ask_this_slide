# Ask This Slide Backend

Local Express API for analyzing a screenshot with the OpenAI Responses API.

## Setup

```bash
npm install
cp .env.example .env
```

Add your API key to `.env`:

```bash
OPENAI_API_KEY=sk-...
```

## Run

```bash
npm run dev
```

The API runs at `http://localhost:8787`.

## Security And Cost Controls

- API keys are loaded from `.env` and are never exposed to the extension.
- `.env` is ignored by Git. Use `.env.example` as the template.
- Screenshots are not saved to disk.
- Analysis results are not stored in a database.
- Base64 screenshot data is not logged.
- JSON body size defaults to `8mb`.
- `imageDataUrl` defaults to a maximum of `6000000` characters.
- Rate limiting defaults to 30 requests per 15 minutes per IP.
- CORS allows localhost and `chrome-extension://...` origins for local MVP development.
- OpenAI output is capped with `max_output_tokens` and a concise prompt.

Environment overrides:

```bash
MAX_REQUEST_SIZE=8mb
MAX_IMAGE_DATA_URL_LENGTH=6000000
```

This MVP is safe for local testing. If this backend is deployed publicly, add authentication or access control before real users use it. An unprotected public backend may cause unexpected OpenAI API costs.

## Endpoint

`POST /api/analyze-frame`

```json
{
  "imageDataUrl": "data:image/png;base64,...",
  "sourceLanguage": "auto",
  "noteLanguage": "zh",
  "academicField": "machine_learning"
}
```

## Error Handling

The backend returns friendly errors for:

- Missing `OPENAI_API_KEY`
- OpenAI analysis failure
- Request body too large
- Rate limit exceeded
- Invalid image data

The extension shows a friendly message if the backend server is not running or the network request fails.
