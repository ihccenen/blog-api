import mongoose, { Model } from 'mongoose';
import bcrypt from 'bcryptjs';

const { Schema } = mongoose;

interface IUser {
  username: string;
  password: string;
}

interface IUserMethods {
  matchPassword(enteredPassword: string): boolean;
}

type UserModel = Model<IUser, {}, IUserMethods>;

const UserSchema = new Schema<IUser, UserModel, IUserMethods>({
  username: { type: String, required: true },
  password: { type: String, required: true },
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.method('matchPassword', async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
});

export default mongoose.model('User', UserSchema);
