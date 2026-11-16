import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on("connect", () => {
  console.log("Database connected successfully");
});

pool.on("error", () => {
  console.error("Error connecting to the Postgres database");
});

export const testConnection = async () => {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("Database connected successfully ");
    console.log("Database connected successfully at:", result.rows[0].now);
  } catch (err) {
    console.error("Error connecting to the Postgres database", err);
  }
};

export default pool;
