import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        role: { type: String, default: '' },
        comment: { type: String, required: true, trim: true },
        rating: { type: Number, min: 1, max: 5, default: 5 },
        avatar: { type: String, default: null },
        isActive: { type: Boolean, default: true }
    },
    { timestamps: true }
);

const Testimonial = mongoose.model('Testimonial', testimonialSchema);
export default Testimonial;
