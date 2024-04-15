import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    resetToken: { type: String },
    isAdmin: { type: Boolean, default: false, required: true },
    profilePhoto: { type: String, default: '' },
  },
  {
    timestamps: true, //add createdat and updatedat
  }
);

const User = mongoose.model('User', userSchema);

export default User;
