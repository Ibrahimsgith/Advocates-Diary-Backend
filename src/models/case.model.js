import mongoose from 'mongoose';

const caseSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  caseNumber: { type: String, index: true, trim: true },
  court: { type: String, trim: true },
  status: { type: String, enum: ['PENDING', 'ACTIVE', 'CLOSED'], default: 'PENDING' },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },   // optional
  advocate: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },   // optional
  notes: { type: String, trim: true }
}, { timestamps: true });

export default mongoose.model('Case', caseSchema);
