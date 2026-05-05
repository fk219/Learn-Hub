import mongoose from 'mongoose'

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    stripeCheckoutSessionId: { type: String, required: true, unique: true },
    amountTotalCents: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true },
    status: { type: String, required: true, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
    items: [
      {
        courseId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Course' },
        priceCents: { type: Number, required: true, min: 0 },
      },
    ],
  },
  { timestamps: true }
)

export const Order = mongoose.model('Order', OrderSchema)

