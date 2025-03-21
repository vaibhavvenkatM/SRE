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
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_leaderBoard = void 0;
const db_1 = require("../config/db");
const get_leaderBoard = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log(`Fetching LeaderBoard`);
        const data = yield (0, db_1.sql) `
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
    }
    catch (error) {
        console.error("Database Error:", error);
        return { error: "Database error" };
    }
});
exports.get_leaderBoard = get_leaderBoard;
