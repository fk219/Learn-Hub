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
    durationWeeks: { type: Number, default: 4, min: 1 },
    outcomes: { type: [String], default: [] },
    modules: {
      type: [
        {
          _id: false,
          title: { type: String, required: true },
          summary: { type: String, required: true },
          lessons: {
            type: [
              {
                _id: false,
                id: { type: String, required: true },
                title: { type: String, required: true },
                kind: { type: String, enum: ['lesson', 'lab', 'critique', 'project'], default: 'lesson' },
                minutes: { type: Number, required: true, min: 1 },
                objective: { type: String, required: true },
              },
            ],
            default: [],
          },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
)

export const Course = mongoose.model('Course', CourseSchema)

