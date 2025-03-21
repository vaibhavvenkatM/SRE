import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {sql} from "../config/db";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JSONTOKEN || "defaultsecret";

interface LoginResponse {
    token?: string;
    user?: { username: string; email: string };
    error?: string;
}

const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
    try {
        const result = await sql<{ id: number; username: string; email: string; password: string }[]>`
            SELECT id, username, email, password FROM users WHERE email = ${email};
        `;

        if (result.length === 0) {
            return { error: "Invalid email or password" }; // Prevents user enumeration
        }

        const user = result[0];

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return { error: "Invalid email or password" }; // Generic error for security
        }

        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
            expiresIn: "24h",
        });

        return { token, user: { username: user.username, email: user.email } };
    } catch (error) {
        console.error("Error in login:", error);
        return { error: "Internal server error" }; // More generic error message
    }
};

export default loginUser;
