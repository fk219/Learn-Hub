import mongoose from 'mongoose'

const CourseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    level: { type: String, required: true },
    priceCents: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, default: 'usd' },
    imageUrl: { type: String, required: true },
    published: { type: Boolean, required: true, default: true },
  },
  { timestamps: true }
)

export const Course = mongoose.model('Course', CourseSchema)

