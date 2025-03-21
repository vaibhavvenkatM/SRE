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
const db_1 = require("../config/db");
const registerUser = (username, email, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate input
        if (!username || !email || !password) {
            return { error: "All fields are required" };
        }
        const existingUser = yield (0, db_1.sql) `
            SELECT id FROM users WHERE email = ${email};
        `;
        if (existingUser.length > 0) {
            return { error: "User already exists" };
        }
        // Hash password
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        // Insert new user
        const result = yield (0, db_1.sql) `
            INSERT INTO users (username, email, password) 
            VALUES (${username}, ${email}, ${hashedPassword}) 
            RETURNING id, username, email;
        `;
        console.log("User Registered:", result[0]);
        return result[0];
    }
    catch (error) {
        console.error("Error registering user:", error);
        return { error: "Internal server error" };
    }
});
exports.default = registerUser;
