"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const queueRoutes_1 = __importDefault(require("./routes/queueRoutes"));
const dataRoutes_1 = __importDefault(require("./routes/dataRoutes"));
const queue_1 = require("./controllers/queue");
const db_1 = require("./config/db");
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, { cors: { origin: "*" } });
exports.io = io;
const PORT = process.env.PORT || 5000;
// Middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: "*",
    credentials: true,
}));
// Routes
app.use("/auth", authRoutes_1.default);
app.use("/queue", queueRoutes_1.default);
app.use("/data", dataRoutes_1.default);
// Root Route
app.get("/", (req, res) => {
    res.send("Welcome to QUIZ");
});
// Handle player disconnections
io.on("connection", (socket) => {
    console.log(`Player connected: ${socket.id}`);
    (0, queue_1.setupGameEndHandler)(socket);
});
(0, db_1.checkConnection)()
    .then(() => {
    // Start Server only if DB is running
    server.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
})
    .catch((err) => {
    console.error("Failed to connect to DB. Server not started.", err);
});
