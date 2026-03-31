import express from 'express';
import { 
    getAllBlogs, 
    getBlogBySlug, 
    getBlogMeta,
    createBlog, 
    updateBlog, 
    deleteBlog, 
    getMyBlogs 
} from '../controller/blogController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/meta', getBlogMeta);
router.get('/:slug', getBlogBySlug);
router.get('/', getAllBlogs);

// Protected routes
router.post('/', protect, upload.single('thumbnail'), createBlog);
router.get('/my-blogs', protect, getMyBlogs);
router.put('/:id', protect, upload.single('thumbnail'), updateBlog);
router.delete('/:id', protect, deleteBlog);

export default router;
