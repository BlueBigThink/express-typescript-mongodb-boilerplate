import mongoose, { Document, Schema } from "mongoose";
import { UserRole, UserStatus } from "../config/const";

export interface IUser extends Document {
  name: string;
  password: string;
  role: Number;
  status: Number;
  createdAt: Date;
}

const UserSchema: Schema<IUser> = new Schema({
  name: { type: String, required: true, trim: true },
  password: { type: String, required: true },
  role: { type: Number, default: UserRole.NORMAL },
  status: { type: Number, default: UserStatus.ALLOWED },
  createdAt: { type: Date, default: Date.now },
});

const UserModel = mongoose.model<IUser>("col_Users", UserSchema);
export default UserModel;
