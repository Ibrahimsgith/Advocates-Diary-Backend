import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: String,
  email: String,
  address: String,
  notes: String
}, { timestamps: true });

export default mongoose.model('Client', clientSchema);