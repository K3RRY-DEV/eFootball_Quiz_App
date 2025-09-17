import mongoose, { Document } from 'mongoose';
import bcrypt from 'bcrypt';
import { IUser } from '../types/user';



interface IUserDocument extends IUser, Document {};


const userSchema = new mongoose.Schema<IUserDocument>({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    default: "user"
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save hook to hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const SALT_ROUNDS = 10;
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashed = await bcrypt.hash(this.password, salt);
    this.password = hashed;
    next();
  } catch (err) {
    next(err as any);
  }
})

export default mongoose.model<IUserDocument>("User", userSchema);