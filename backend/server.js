import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.route.js";  
import jokeRoutes from "./routes/joke.route.js";

import { connectDB } from "./db/connectDB.js";
import { deleteJokesWithZeroVotes } from "./controllers/joke.controller.js"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/joke", jokeRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();

  // Automated Cleanup: Deletes jokes with 0 votes every hour
  setInterval(deleteJokesWithZeroVotes, 60 * 60 * 1000); // Runs every 1 hour
});
