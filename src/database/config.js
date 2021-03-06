import dotenv from "dotenv";
dotenv.config();

export default {
  user: process.env.DB_USER,
  pass: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  name: process.env.DB_NAME,
  options: process.env.DB_OPTIONS,
};
