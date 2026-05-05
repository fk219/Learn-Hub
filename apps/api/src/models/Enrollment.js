import mongoose from 'mongoose'

const EnrollmentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    courseId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Course' },
    status: { type: String, required: true, enum: ['active', 'revoked'], default: 'active' },
  },
  { timestamps: true }
)

EnrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true })

export const Enrollment = mongoose.model('Enrollment', EnrollmentSchema)

