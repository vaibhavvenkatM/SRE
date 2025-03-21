import bcrypt from "bcryptjs";
import {sql} from "../config/db";

interface RegisterResponse {
    id?: number;
    username?: string;
    email?: string;
    error?: string;
}

const registerUser = async (username: string, email: string, password: string): Promise<RegisterResponse> => {
    try {
        // Validate input
        if (!username || !email || !password) {
            return { error: "All fields are required" };
        }

        const existingUser = await sql`
            SELECT id FROM users WHERE email = ${email};
        `;
        if (existingUser.length > 0) {
            return { error: "User already exists" };
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        const result = await sql`
            INSERT INTO users (username, email, password) 
            VALUES (${username}, ${email}, ${hashedPassword}) 
            RETURNING id, username, email;
        `;

        console.log("User Registered:", result[0]);
        return result[0];
    } catch (error) {
        console.error("Error registering user:", error);
        return { error: "Internal server error" };
    }
};

export default registerUser;
