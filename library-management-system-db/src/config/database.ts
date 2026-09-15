import mysql from "mysql2/promise";

const db = mysql.createPool({
    host: process.env.MY_SQL_HOST || "localhost",
    user: process.env.MY_SQL_USER || "root",
    password: process.env.MY_SQL_PASSWORD!,
    database: process.env.MY_SQL_DATABASE!,
    waitForConnections: true,
    connectionLimit: 10,
});

export default db;