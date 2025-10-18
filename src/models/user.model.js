import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['ADMIN', 'ADVOCATE', 'PARALEGAL'], default: 'ADVOCATE' }
}, { timestamps: true });

userSchema.methods.comparePassword = function(pw) {
  return bcrypt.compare(pw, this.passwordHash);
};

const User = mongoose.model('User', userSchema);
export default User;