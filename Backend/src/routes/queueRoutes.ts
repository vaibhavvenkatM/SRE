import express from "express";
import authenticateUser from "../config/authMiddleware";
import { joinQueue , leaveQueue } from "../controllers/queue";

const router = express.Router();

// Player joins the queue
router.get("/join", authenticateUser,joinQueue);

// Player leaves the queue
router.get("/leave", authenticateUser, leaveQueue);

export default router;
