import { sql } from "../config/db";

const get_leaderBoard = async () => {
    try {
        // console.log(`Fetching LeaderBoard`);
        const data = await sql`
            SELECT uh.userid, u.username, uh.points, uh.win, uh.loss, uh.draw 
            FROM "userhistory" uh
            JOIN "users" u ON uh.userid = u.id
            ORDER BY uh.points DESC, uh.win DESC;
        `;
        
        if (data.length === 0) {
            console.log("Data not Found");
            return { error: "Data not found" };
        }
        
        return { leaderboard: data };
    } catch (error) {
        console.error("Database Error:", error);
        return { error: "Database error" };
    }
};

// const fetchData = async () => {
//     const leaderboard = await get_leaderBoard();
//     console.log(leaderboard);
// };

// fetchData();

export { get_leaderBoard };
