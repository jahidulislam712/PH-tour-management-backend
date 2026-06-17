import { Types } from "mongoose";

export enum Role{
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  USER = "USER",
  GUIDE = "GUIDE"
}

// auth providers
/**
 * email, password
 * google authentication
 */
export interface IAuthProvider{
  provider: "google" | "credentials" // google, credentials
  providerId: string
}

export enum IsActive{
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED"
}

export interface IUser{
  _id?: Types.ObjectId;
  name: string;
  email: string;
  phone ?: string;
  password: string;
  picture ?: string;
  address ?: string;
  isDelete ?: boolean;
  isActive ?: IsActive;
  isVerified ?: boolean;
  role: Role;
  auths: IAuthProvider[];
  bookings ?: Types.ObjectId[];
  guides ?: Types.ObjectId[];
}