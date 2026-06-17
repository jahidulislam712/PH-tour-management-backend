import { User } from "./user.model";
import { IAuthProvider, IUser, Role } from "./user.interface";
import AppError from "../../errorHelpers/appError";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcryptjs";
import { JwtPayload } from "jsonwebtoken";

// Create new user
const createUser = async (payload: Partial<IUser>) => {
  const {email, password, ...rest} = payload;

  if( !email ){
    throw new AppError( StatusCodes.BAD_GATEWAY, "Email cannot be empty")
  }

  const isUserExist = await User.findOne({email})

  if( isUserExist ){
    throw new AppError( StatusCodes.BAD_GATEWAY, "User already exists")
  }

  const hashedPassword = await bcrypt.hash(password as string, 10)
  

  const authProvier: IAuthProvider = {
    provider: "credentials",
    providerId: email
  }

  const user = await User.create({
    email,
    password: hashedPassword,
    auths: [authProvier],
    ...rest
  });

  return user;
}

// update existing user
const updateUser = async (userId:string, payload: Partial<IUser>, decodedToken:JwtPayload) => {

  const targetUser = await User.findById(userId)

  if( ! targetUser ){
    throw new AppError(StatusCodes.NOT_FOUND, "User not found!!")
  }

  const isSelf = decodedToken.userId === userId


  /**
   * USER and GUIDE cannot modiy other profile, own ROLE, isVerified, isActivate, isDelete
   * ADMIN cannot modify SUPER_ADMIN
   */

  // Logged in USER and GUIDE can modify their own profile
  if( ( decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE ) && ! isSelf ){
    throw new AppError(StatusCodes.FORBIDDEN, "You are not authorized.")
  }

  // USER and GUIDE cannot update restricted fields
  if( (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) && (payload.role || payload.isActive || payload.isDelete || payload.isVerified) ){
    throw new AppError(StatusCodes.FORBIDDEN, "You are not authorized.")
  }

  // No one can modify SUPER_ADMIN except himself
  if(targetUser.role === Role.SUPER_ADMIN && !isSelf){
    throw new AppError(StatusCodes.FORBIDDEN, "You are not authorized.")
  }

  // No one can modify own ROLE
  if( userId === decodedToken.userId && payload.role){
    throw new AppError(StatusCodes.FORBIDDEN, "You are not authorized.")
  }

  // No one can make SUPER_ADMIN
  if( payload.role === Role.SUPER_ADMIN ){
    throw new AppError(StatusCodes.FORBIDDEN, "You are not authorized.")
  }

  const updatedUser = await User.findByIdAndUpdate(userId, payload, {returnDocument: "after", runValidators: true})

  return updatedUser;
}

// get all users
const getAllUsers = async () => {
  const users = await User.find()

  const totalUsers = await User.countDocuments();
  return {
    data: users,
    meta: {
      total: totalUsers
    }
  }
}

export const userServices = {
  createUser,
  updateUser,
  getAllUsers
}