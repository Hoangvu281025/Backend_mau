
import db from "../config/db.js";



export const getUser = (req, res) => {

  const sql = "SELECT email FROM users ";


  db.query(sql, (err, data) => {
    if (err) return res.status(500).json(err);

    
    res.json(data);
  });
};


