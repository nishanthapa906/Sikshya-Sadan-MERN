import Blog from "../models/blogModel.js";

// Get all blogs (public)
export const getAllBlogs = async (req, res) => {
    try {
        const { category, search, page = 1, limit = 10 } = req.query;
        
        let filter = { isPublished: true };
        
        if (category) filter.category = category;
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } }
            ];
        }
        
        const blogs = await Blog.find(filter)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);
        
        const total = await Blog.countDocuments(filter);
        
        res.status(200).json({
            status: 200,
            success: true,
            data: {
                blogs,
                totalPages: Math.ceil(total / limit),
                currentPage: page
            }
        });
    } catch (err) {
        res.status(500).json({
            status: 500,
            success: false,
            message: err.message
        });
    }
};

// Get blog by slug
export const getBlogBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        
        const blog = await Blog.findOneAndUpdate(
            { slug, isPublished: true },
            { $inc: { views: 1 } },
            { new: true }
        );
        
        if (!blog) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: "Blog not found"
            });
        }
        
        res.status(200).json({
            status: 200,
            success: true,
            data: blog
        });
    } catch (err) {
        res.status(500).json({
            status: 500,
            success: false,
            message: err.message
        });
    }
};

// Get blog metadata (categories, etc.)
export const getBlogMeta = async (req, res) => {
    try {
        const categories = await Blog.distinct('category', { isPublished: true });
        const totalBlogs = await Blog.countDocuments({ isPublished: true });
        
        res.status(200).json({
            status: 200,
            success: true,
            data: {
                categories,
                totalBlogs
            }
        });
    } catch (err) {
        res.status(500).json({
            status: 500,
            success: false,
            message: err.message
        });
    }
};

// Create blog (instructor/admin only)
export const createBlog = async (req, res) => {
    try {
        const { title, slug, content, category, excerpt, tags } = req.body;
        const thumbnail = req.file?.filename;
        
        const blog = new Blog({
            title,
            slug,
            content,
            thumbnail,
            category,
            excerpt,
            tags,
            author: {
                _id: req.user._id,
                name: req.user.name,
                email: req.user.email
            }
        });
        
        await blog.save();
        
        res.status(201).json({
            status: 201,
            success: true,
            data: blog
        });
    } catch (err) {
        res.status(500).json({
            status: 500,
            success: false,
            message: err.message
        });
    }
};

// Update blog
export const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, slug, content, category, excerpt, tags, isPublished } = req.body;
        
        const blog = await Blog.findById(id);
        
        if (!blog) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: "Blog not found"
            });
        }
        
        // Check if user is author
        if (blog.author._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                status: 403,
                success: false,
                message: "Not authorized to update this blog"
            });
        }
        
        blog.title = title || blog.title;
        blog.slug = slug || blog.slug;
        blog.content = content || blog.content;
        blog.category = category || blog.category;
        blog.excerpt = excerpt || blog.excerpt;
        blog.tags = tags || blog.tags;
        blog.isPublished = isPublished !== undefined ? isPublished : blog.isPublished;
        
        if (req.file?.filename) {
            blog.thumbnail = req.file.filename;
        }
        
        await blog.save();
        
        res.status(200).json({
            status: 200,
            success: true,
            data: blog
        });
    } catch (err) {
        res.status(500).json({
            status: 500,
            success: false,
            message: err.message
        });
    }
};

// Delete blog
export const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;
        
        const blog = await Blog.findById(id);
        
        if (!blog) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: "Blog not found"
            });
        }
        
        // Check if user is author
        if (blog.author._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                status: 403,
                success: false,
                message: "Not authorized to delete this blog"
            });
        }
        
        await Blog.findByIdAndDelete(id);
        
        res.status(200).json({
            status: 200,
            success: true,
            message: "Blog deleted successfully"
        });
    } catch (err) {
        res.status(500).json({
            status: 500,
            success: false,
            message: err.message
        });
    }
};

// Get my blogs (logged in user)
export const getMyBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({ 'author._id': req.user._id })
            .sort({ createdAt: -1 });
        
        res.status(200).json({
            status: 200,
            success: true,
            data: blogs
        });
    } catch (err) {
        res.status(500).json({
            status: 500,
            success: false,
            message: err.message
        });
    }
};
