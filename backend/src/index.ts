import cors from "cors";
import dotenv from "dotenv";
import express, { type ErrorRequestHandler } from "express";
import rateLimit from "express-rate-limit";
import { analyzeFrameRouter } from "./routes/analyzeFrame.js";

dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? 8787);
const maxRequestSize = process.env.MAX_REQUEST_SIZE ?? "8mb";

const allowedLocalOrigins = [/^chrome-extension:\/\/[a-z]+$/, /^http:\/\/localhost(:\d+)?$/, /^http:\/\/127\.0\.0\.1(:\d+)?$/];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedLocalOrigins.some((allowedOrigin) => allowedOrigin.test(origin))) {
        callback(null, true);
        return;
      }

      callback(new Error("CORS origin is not allowed for this local MVP."));
    }
  })
);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      error: "Rate limit exceeded",
      message: "Too many frame analyses. Please wait a few minutes before trying again."
    }
  })
);

app.use(express.json({ limit: maxRequestSize }));

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api", analyzeFrameRouter);

const errorHandler: ErrorRequestHandler = (error, _req, res, next) => {
  if (res.headersSent) {
    next(error);
    return;
  }

  if (error?.type === "entity.too.large") {
    res.status(413).json({
      error: "Request too large",
      message: "The screenshot is too large to analyze. Try a smaller browser window or lower zoom level."
    });
    return;
  }

  if (error instanceof SyntaxError && "body" in error) {
    res.status(400).json({
      error: "Invalid JSON",
      message: "The request body could not be read. Please capture the frame again."
    });
    return;
  }

  if (error instanceof Error && error.message.includes("CORS")) {
    res.status(403).json({
      error: "Origin not allowed",
      message: "This backend only accepts requests from the local extension or localhost during MVP testing."
    });
    return;
  }

  next(error);
};

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Ask This Slide backend listening on http://localhost:${port}`);
});
