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
import { protect, authorize } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Protected routes
router.post('/', protect, authorize('admin', 'instructor'), upload.single('thumbnail'), createBlog);
router.get('/my-blogs', protect, authorize('admin', 'instructor'), getMyBlogs);
router.put('/:id', protect, authorize('admin', 'instructor'), upload.single('thumbnail'), updateBlog);
router.delete('/:id', protect, authorize('admin', 'instructor'), deleteBlog);

// Public routes
router.get('/meta', getBlogMeta);
router.get('/', getAllBlogs);
router.get('/:slug', getBlogBySlug);

export default router;
