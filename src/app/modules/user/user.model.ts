import { model, Schema } from "mongoose";
import { IAddress, IAuthProvider, IsActive, IUser, Role } from "./user.interface";

const authProviderSchema = new Schema<IAuthProvider>({
  provider: {type: String, required: true},
  providerId: {type: String, required: true},
}, {
  versionKey: false,
  _id: false
})

const addressSchema = new Schema<IAddress>({
  division: {type: String, required: true},
  district: {type: String, required: true},
  upazila: {type: String, required: true},
  postOffice: {type: String, required: true},
  village: {type: String, required: true}
}, {
  timestamps: false,
  _id: false,
  versionKey: false
})

const userSchema = new Schema<IUser>({
  name: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  password: String,
  phone: String,
  picture: String,
  address: addressSchema,
  isDelete: {type: Boolean, default: false},
  isActive: {
    type: String,
    enum: Object.values(IsActive),
    default: IsActive.ACTIVE
  },
  isVerified: {type: Boolean, default: false},
  role: {
    type: String,
    enum: Object.values(Role),
    default: Role.USER
  },
  auths: [authProviderSchema]
}, {
  timestamps: true,
  versionKey: false,
  toObject: {virtuals: true},
  toJSON: {virtuals: true}
})

export const User = model<IUser>('User', userSchema)