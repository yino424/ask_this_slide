# Ask This Slide Extension

Chrome Extension Manifest V3 popup for capturing the current visible tab and sending it to the local backend.

## Setup

```bash
npm install
npm run build
```

Load `extension/dist` in Chrome as an unpacked extension.

## Local Backend

The extension calls:

```text
http://localhost:8787/api/analyze-frame
```

Start the backend before analyzing a frame.

