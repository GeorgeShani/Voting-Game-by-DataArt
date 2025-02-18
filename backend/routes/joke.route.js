import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js"
import { getJoke, submitVote } from "../controllers/joke.controller.js";

const router = express.Router();

router.get("/", getJoke);
router.post("/:id", protectRoute, submitVote);

export default router;
