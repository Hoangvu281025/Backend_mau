import express from "express";
import {
  getBanner,
  getBannerAdmin,
  createBanner,
  updateBanner
} from "../controllers/bannerController.js";


import { verifyToken, isAdmin } from "../middleware/auth.js";

const router = express.Router();



router.get('/', getBanner);
router.get('/banner-admin', getBannerAdmin);
// router.get("/:slug", getPostDetail);
router.post("/",verifyToken, isAdmin, createBanner);
router.post("/update",verifyToken, isAdmin, updateBanner);
// router.delete("/:id", deleteBanner);

export default router;