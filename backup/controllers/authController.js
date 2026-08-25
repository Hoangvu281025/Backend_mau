import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../config/db.js";



export const loginAdmin = async (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM users WHERE email = ?";

    db.query(sql, [email], async (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) return res.status(404).json({"message": "Tài khoản hoặc mật khẩu không đúng"});   
        const user = data[0];

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) return res.status(401).json({"message": "Mật khẩu không đúng"});

        const token = jwt.sign({ id: user.id , role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.json({
            token: `Bearer ${token}`,
            user:{
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    });
};


export const createAccount = (req, res) => {
    const { email, password } = req.body;

    const sqlCheck = "SELECT * FROM users WHERE email = ?";

    db.query(sqlCheck, [email], async (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length > 0) return res.status(400).json("Email đã tồn tại");

        const hashedPassword = await bcrypt.hash(password, 10);
        const sqlInsert = "INSERT INTO users (email, password) VALUES ( ?, ?)"; 
        db.query(sqlInsert, [email, hashedPassword], (err, data) => {
            if (err) return res.status(500).json(err);
            res.json("Tạo tài khoản thành công");
        }
        );
    });
};