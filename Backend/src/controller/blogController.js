import Blog from "../models/blogModel.js";

export const getAllBlogs = async (req, res) => {
    try {
        const { category, search, page = 1, limit = 10 } = req.query;
        const filter = { isPublished: true };
        if (category) filter.category = category;
        if (search) filter.$or = [{ title: { $regex: search, $options: 'i' } }, { content: { $regex: search, $options: 'i' } }];
        const blogs = await Blog.find(filter).sort({ createdAt: -1 }).limit(limit * 1).skip((page - 1) * limit);
        const total = await Blog.countDocuments(filter);
        res.json({ success: true, data: { blogs, totalPages: Math.ceil(total / limit), currentPage: page } });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getBlogBySlug = async (req, res) => {
    try {
        const blog = await Blog.findOneAndUpdate({ slug: req.params.slug, isPublished: true }, { $inc: { views: 1 } }, { new: true });
        if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
        res.json({ success: true, data: blog });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getBlogMeta = async (req, res) => {
    try {
        const categories = await Blog.distinct('category', { isPublished: true });
        const totalBlogs = await Blog.countDocuments({ isPublished: true });
        res.json({ success: true, data: { categories, totalBlogs } });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const createBlog = async (req, res) => {
    try {
        const { title, slug, content, category, excerpt, tags, isPublished } = req.body;
        const parsedTags = Array.isArray(tags) ? tags : String(tags || '').split(',').map(t => t.trim()).filter(Boolean);
        const blog = await Blog.create({
            title, slug, content, thumbnail: req.file?.filename, category, excerpt,
            tags: parsedTags, isPublished: isPublished === 'false' ? false : true,
            author: { _id: req.user._id, name: req.user.name, email: req.user.email }
        });
        res.status(201).json({ success: true, data: blog });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const updateBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
        if (blog.author._id.toString() !== req.user._id.toString() && req.user.role !== 'admin')
            return res.status(403).json({ success: false, message: 'Not authorized' });
        const { title, slug, content, category, excerpt, tags, isPublished } = req.body;
        blog.title = title || blog.title;
        blog.slug = slug || blog.slug;
        blog.content = content || blog.content;
        blog.category = category || blog.category;
        blog.excerpt = excerpt || blog.excerpt;
        if (tags !== undefined) blog.tags = Array.isArray(tags) ? tags : String(tags).split(',').map(t => t.trim()).filter(Boolean);
        if (isPublished !== undefined) blog.isPublished = isPublished === true || isPublished === 'true';
        if (req.file?.filename) blog.thumbnail = req.file.filename;
        await blog.save();
        res.json({ success: true, data: blog });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
        if (blog.author._id.toString() !== req.user._id.toString() && req.user.role !== 'admin')
            return res.status(403).json({ success: false, message: 'Not authorized' });
        await Blog.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Blog deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getMyBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({ 'author._id': req.user._id }).sort({ createdAt: -1 });
        res.json({ success: true, data: blogs });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
