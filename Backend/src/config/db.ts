import postgres from "postgres";
import * as dotenv from "dotenv";

dotenv.config();

// Validate DATABASE_URL 
if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not defined in .env file.");
    process.exit(1); 
}

const sql = postgres(process.env.DATABASE_URL!, {
    ssl: "require", 
});

const checkConnection = async () => {
    try {
        await sql`SELECT 1`;
        console.log("Database connection successful");
    } catch (error) {
        console.error("Database connection failed:", error);
    }
};

export { sql, checkConnection };

