"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const register_1 = __importDefault(require("../controllers/register"));
const login_1 = __importDefault(require("../controllers/login"));
const router = express_1.default.Router();
// End point
router.get("/", (req, res) => {
    res.send("Welcome to Users Page");
});
router.get("/register", (req, res) => {
    res.send("Welcome to Register User Page");
});
// Register User Route
router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    const result = yield (0, register_1.default)(username, email, password);
    if (result.error) {
        return res.status(400).json({ message: result.error });
    }
    res.status(201).json({ message: "User registered successfully", user: result });
}));
router.get("/login", (req, res) => {
    res.send("Welcome to Login User Page");
});
// Login User Route
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    const result = yield (0, login_1.default)(email, password);
    if (result.error) {
        return res.status(400).json({ message: result.error });
    }
    res.cookie("token", result.token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ message: "Login successful", token: result.token, user: result.user });
}));
exports.default = router;
