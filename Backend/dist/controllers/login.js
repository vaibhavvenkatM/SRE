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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../config/db");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JSONTOKEN || "defaultsecret";
const loginUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, db_1.sql) `
            SELECT id, username, email, password FROM users WHERE email = ${email};
        `;
        if (result.length === 0) {
            return { error: "Invalid email or password" }; // Prevents user enumeration
        }
        const user = result[0];
        const isPasswordCorrect = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordCorrect) {
            return { error: "Invalid email or password" }; // Generic error for security
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, username: user.username }, JWT_SECRET, {
            expiresIn: "24h",
        });
        return { token, user: { username: user.username, email: user.email } };
    }
    catch (error) {
        console.error("Error in login:", error);
        return { error: "Internal server error" }; // More generic error message
    }
});
exports.default = loginUser;
