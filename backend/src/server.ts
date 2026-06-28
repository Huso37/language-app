import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import { generateLessonRouter } from "./routes/generateLesson.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "language-app-backend",
  });
});

app.use("/generate-lesson", generateLessonRouter);

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});