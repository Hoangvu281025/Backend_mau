import express from "express";
import {
  getposts,
  getpostAdmindata,
  getpostHome,
  getpostAdmin,
  getPostDetail,
  createPost,
  updatePost,
  deletePost
} from "../controllers/postController.js";
import { verifyToken, isAdmin } from "../middleware/auth.js";

const router = express.Router();


//home
router.get('/post-list',getposts);
router.get('/post-admin',getpostAdmindata);
router.get('/admin',getpostAdmin); 
router.get('/home',getpostHome);

router.get('/:slug', getPostDetail);




//admin


router.delete('/:slug',verifyToken, isAdmin, deletePost);
router.post("/",verifyToken, isAdmin, createPost);
router.put('/:slug',verifyToken, isAdmin, updatePost);

export default router;