import { sql } from "../config/db";

// Fetch all questions related to a topic
const  getQuestionsByTopicId = async (topicId: string) => {
    try {
        console.log(`Fetching questions for topic ID: ${topicId}`);
        const data = await sql`SELECT * FROM queoptn WHERE topic_id = ${topicId};`;
        if (data.length === 0) {
            console.log("No questions found for this topic");
            return { error: "No questions found" };
        }
        return data;
    } catch (error) {
        console.error("Error fetching questions:", error);
        return { error: "Database error" };
    }
};

const getTopicByTopicId = async (topicId: string) => {
    try {
        console.log(`Fetching topic for topic ID: ${topicId}`);
        const data = await sql`SELECT * FROM topics WHERE id = ${topicId};`;
        if (data.length === 0) {
            console.log("No Topic Found");
            return { error: "No Topic Found" };
        }
        return data;
    } catch (error) {
        console.error("Error fetching Topics:", error);
        return { error: "Database error" };
    }
};

// const fetchData = async (id : string) => {
//     const leaderboard = await getTopicByTopicId(id);
//     console.log(leaderboard);
// };

// fetchData("1");
// fetchData("2");
// fetchData("3");
// fetchData("4");
// fetchData("5");

export  { getQuestionsByTopicId , getTopicByTopicId};
