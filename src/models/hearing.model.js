import mongoose from 'mongoose';

const hearingSchema = new mongoose.Schema({
  case: { type: mongoose.Schema.Types.ObjectId, ref: 'Case', required: true },
  date: { type: Date, required: true },
  purpose: String,
  orders: String,
  nextDate: Date
}, { timestamps: true });

export default mongoose.model('Hearing', hearingSchema);