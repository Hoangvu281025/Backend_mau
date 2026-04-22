import express from "express";
import upload from "../config/upload.js";
import { deleteImage, uploadImage } from "../controllers/uploadController.js";
import { verifyToken, isAdmin } from "../middleware/auth.js";

const router = express.Router();

router.post("/",verifyToken, isAdmin, upload.single("file"), uploadImage);
router.delete("/",verifyToken, isAdmin, deleteImage);

export default router;