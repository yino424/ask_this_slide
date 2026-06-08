# Ask This Slide

🎓✨A Chrome extension for turning the slide or video frame you are watching into bilingual study notes. Built for local use, with your own OpenAI API key. 🎓✨

## Why I Built This

As an international student, I often feel stuck between two kinds of learning resources:

- Pure Chinese explanations are easier to understand, but I may miss the original academic terms.
- Pure English lectures keep the right terminology, but I sometimes cannot connect the terms to the Chinese meaning quickly enough.

I really like watching 3Blue1Brown's neural network teaching videos. They are beautiful, intuitive, and genuinely helpful. But for me, the best learning experience is not simply "English only" or "Chinese only". A good bilingual explanation matters a lot: it helps me understand the concept in Chinese while still remembering the original English terms, such as `Neural Network`, `Gradient Descent`, `Loss Function`, and `Backpropagation`.

So I built Ask This Slide. 🌱

The hope is simple: help international students, bilingual learners, and anyone studying ideas from another language or academic tradition understand concepts more comfortably, without losing the original terminology.

## What It Does

Ask This Slide lets you:

- Click one button in a Chrome extension popup.
- Capture the current visible browser frame.
- Send the screenshot to your own local backend.
- Ask OpenAI Vision to explain what the teacher is probably talking about.
- Get concise bilingual study notes with standard English academic terms.

It is not just a screenshot translator. It tries to understand slides, formulas, code, charts, diagrams, arrows, and visual structure.

## Local-Only MVP

This version is intentionally small:

- Chrome Extension Manifest V3 popup
- React + Vite + TypeScript frontend
- Local Node.js + Express + TypeScript backend
- OpenAI Responses API with a vision-capable model
- Structured bilingual study notes
- No login
- No database
- No audio recognition
- No speech-to-text
- No separate OCR pipeline

## Project Layout

```text
ask_this_slide/
├── extension/
├── backend/
└── docs/
```

## Quick Start

1. Start the backend:

```bash
cd backend
cp .env.example .env
# Add your own OPENAI_API_KEY to .env
npm install
npm run dev
```

2. Build the extension:

```bash
cd extension
npm install
npm run build
```

3. Load the extension in Chrome:

- Open `chrome://extensions`
- Enable Developer mode
- Click Load unpacked
- Select `extension/dist`

The popup sends screenshots to:

```text
http://localhost:8787/api/analyze-frame
```

## API Key Safety

This project uses a bring-your-own-key local setup:

- Your `OPENAI_API_KEY` lives only in `backend/.env`.
- `.env` is ignored by Git.
- The Chrome extension never sees your OpenAI API key.
- The extension only calls your own local backend.
- The backend is the only place that calls OpenAI.

If someone else clones this repository, they must use their own OpenAI API key. They will not use mine, and they should not use yours. 🔐

## Privacy And Cost Controls

This MVP is designed for local testing:

- Screenshots are processed only for the current request.
- Screenshots are not saved to disk.
- Analysis results are not stored in a database.
- Base64 screenshot data is not logged.
- Screenshots are compressed before upload when possible.
- Express has a clear request-size limit.
- The backend rejects oversized or invalid image data.
- Basic rate limiting is enabled: 30 requests per 15 minutes per IP.
- CORS allows localhost and Chrome extension origins for local development.
- OpenAI responses are capped and prompted to stay concise.

## Public Deployment Warning

This MVP is safe for local testing.

If the backend is deployed publicly, add authentication, access control, or user-owned API keys before real users use it. An unprotected public backend may cause unexpected OpenAI API costs.

## Example Output

For an English slide:

```text
Neural Network: 神经网络，用来学习输入和输出之间的复杂关系。
Gradient Descent: 梯度下降，一种通过不断调整参数来降低 loss 的优化方法。
```

For a non-English slide:

```text
反向传播 -> Backpropagation: A method for updating neural network parameters by propagating errors backward from the output layer.
損失関数 -> Loss Function: A function that measures the difference between a model's prediction and the correct answer.
```

## Notes

Ask This Slide is a student-built local MVP. It is meant to make learning feel a little less lonely and a little more connected across languages. 💛
