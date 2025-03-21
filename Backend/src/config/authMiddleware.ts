import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JSONTOKEN || "defaultsecret";

interface AuthRequest extends Request {
    user?: { id: number; username: string };
}

const authenticateUser = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const token = req.header("Authorization")?.split(" ")[0];

    if (!token) {
        res.status(401).json({ error: "Access denied. No token provided." });
        return; 
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: number; username: string };
        req.user = decoded;
        return next(); 
    } catch (error) {
        res.status(403).json({ error: "Invalid or expired token." });
        return; 
    }
};

export default authenticateUser;
