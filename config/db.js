import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 27673,
  ssl: {
    rejectUnauthorized: false // Bắt buộc cho Aiven
  },
  waitForConnections: true,
  connectionLimit: 3,
});
// const db = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     port: process.env.DB_PORT,
//     ssl: {
//         rejectUnauthorized: false // Bắt buộc cho Aiven
//     },
// })

// db.connect((err) => {
//     if (err) {
//         console.log("Error connecting to database:", err);
//     } else {
//         console.log("Connected to database");
//     }
// });

// Test thử kết nối
db.getConnection((err, connection) => {
  if (err) {
    console.log("Error connecting to database:", err);
  } else {
    console.log("Connected to Aiven MySQL database!");
    connection.release();
  }
});

export default db;