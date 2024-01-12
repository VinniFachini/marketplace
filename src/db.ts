// src/db.ts
import mysql, { Connection, MysqlError, QueryFunction } from 'mysql';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Database connection configuration
const dbConfig: mysql.ConnectionConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
};

// Create MySQL connection
const db: Connection = mysql.createConnection(dbConfig);

// Connect to the database
db.connect((err: MysqlError | null) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to the database');
  }
});

/**
 * Type definition for the queryAsync function.
 */
type QueryAsyncFunction = {
  (sql: string): Promise<any>;
  (sql: string, values: any[]): Promise<any>;
};

/**
 * A wrapper around the MySQL query function to use Promises.
 */
const queryAsync: QueryAsyncFunction = (sql: string, values?: any[]): Promise<any> => {
  return new Promise((resolve, reject) => {
    db.query(sql, values, (err: MysqlError | null, results?: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

export { queryAsync };
