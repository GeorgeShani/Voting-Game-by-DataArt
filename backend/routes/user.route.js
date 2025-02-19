import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getVotedJokes,
  getMostCommonUserEmoji,
  getUserVoteCountLast24Hours,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/voted-jokes", protectRoute, getVotedJokes);
router.get("/common-emoji", protectRoute, getMostCommonUserEmoji)
router.get("/vote-count-24h", protectRoute, getUserVoteCountLast24Hours);;

export default router;