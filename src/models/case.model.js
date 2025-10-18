import mongoose from 'mongoose';

const caseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  caseNumber: { type: String, index: true },
  court: String,
  status: { type: String, enum: ['PENDING', 'ACTIVE', 'CLOSED'], default: 'PENDING' },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
  advocate: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  notes: String
}, { timestamps: true });

export default mongoose.model('Case', caseSchema);