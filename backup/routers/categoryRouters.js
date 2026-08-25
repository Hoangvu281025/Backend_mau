import express from "express";
import {
  getCategories,
  getCateAdmin
} from "../controllers/categoryController.js";

const router = express.Router();



router.get('/',getCategories);
router.get('/admin',getCateAdmin);


export default router;