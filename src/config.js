import dotenv from "dotenv";
dotenv.config();

export const TOKEN = process.env.BOT_TOKEN;
export const BOT = Number(process.env.BOT_ID);
export const OWNER = Number(process.env.BOT_OWNER);
