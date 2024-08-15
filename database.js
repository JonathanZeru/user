import { createPool } from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();
const pool = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS, // Update with your MySQL password
  database: process.env.MYSQL_DB, // Update with your database name
  connectionLimit: 10
});

export default pool;
