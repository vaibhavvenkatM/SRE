"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = __importDefault(require("../config/authMiddleware"));
const queue_1 = require("../controllers/queue");
const router = express_1.default.Router();
// Player joins the queue
router.get("/join", authMiddleware_1.default, queue_1.joinQueue);
// Player leaves the queue
router.get("/leave", authMiddleware_1.default, queue_1.leaveQueue);
exports.default = router;
