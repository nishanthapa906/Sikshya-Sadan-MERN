import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    thumbnail: { type: String },
    category: { type: String, required: true },
    author: {
        _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        name: String,
        email: String
    },
    excerpt: String,
    views: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
    tags: [String]
}, { timestamps: true });

const Blog = mongoose.model('Blog', blogSchema);
export default Blog;
