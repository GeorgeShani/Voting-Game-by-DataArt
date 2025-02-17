import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Why did the scarecrow win an award? Because he was outstanding in his field.");
});

router.get("/dark", (req, res) => {
  res.send("Why don't scientists trust atoms? Because they make up everything.");
});

export default router;
