import express from "express";
import {
  loginAdmin,
  createAccount
} from "../controllers/authController.js";
import { loginLimiter } from "../middleware/rateLimiter.js";
const router = express.Router();




router.post('/login',loginLimiter ,loginAdmin);
router.post('/create-account',createAccount);



export default router;