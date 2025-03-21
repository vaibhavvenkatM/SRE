import express, { Request, Response } from "express";
import { get_leaderBoard } from "../controllers/data"; 

const router = express.Router();

// Get Leaderboard
router.get("/leaderboard", async (req, res) => {
    const result = await get_leaderBoard();
    res.json({ message: result});
});

export default router;
