import { StatusCodes } from "http-status-codes"
import AppError from "../../errorHelpers/appError"
import { IAuthProvider, IsActive, IUser } from "../user/user.interface"
import { User } from "../user/user.model"
import bcrypt from "bcryptjs"
import { createNewAccessTokenWithRefreshToken, createUserTokens } from "../../utils/userTokens"
import { JwtPayload } from "jsonwebtoken"
import { envVars } from "../../config/env"
import jwt from "jsonwebtoken"
import { sendEmail } from "../../utils/sendEmail"

// credentials login
const credentialsLogin = async (payload: Pick<IUser, "email" | "password">) => {
  const {email, password} = payload


  const user = await User.findOne({ email }).select("+password")

  if( !user ){
    throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid email or password")
  }

  const passwordMatch = await bcrypt.compare(password as string, user.password as string)
  
  if (!passwordMatch){
    throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid email or password.")
  }

  const userTokens = createUserTokens(user)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {password: pass, ...rest} = user.toObject()

  return {
    accessToken: userTokens.accessToken,
    refreshToken: userTokens.refreshToken,
    user: rest
  };
}

// get new access token 
const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken);
  return {
    accessToken: newAccessToken
  }
}

// change password
const changePassword = async (oldPassword: string, newPassword: string, decodedToken: JwtPayload) => {
  const user = await User.findById(decodedToken.userId)

  if( !user ){
    throw new AppError(StatusCodes.NOT_FOUND, "User does not exist")
  }

  const isOldPasswordMatch = await bcrypt.compare(oldPassword, user.password as string)

  if( ! isOldPasswordMatch ){
    throw new AppError(StatusCodes.UNAUTHORIZED, "Old password doesn't match")
  }

  user.password = await bcrypt.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND))

  await user.save()
}

// set password
const setPassword = async (userId: string, password: string) => {

  const user = await User.findById(userId)

  if( !user ) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found")
  }

  if( user.auths.some(authProvider => authProvider.provider === "google") && user.password){
    throw new AppError(StatusCodes.BAD_REQUEST, "You already have set your password. You can change that from your profile if needed")
  }

  const hashedPassword = await bcrypt.hash(password, Number(envVars.BCRYPT_SALT_ROUND))

  const credentialsProvider: IAuthProvider = {
    provider: "credentials",
    providerId: user.email
  }

  user.password = hashedPassword
  user.auths.push(credentialsProvider)

  user.save()
}

// forgot password
const forgotPassword = async (email: string) => {
  const isUserExist = await User.findOne({email})
  if( ! isUserExist ){
    throw new AppError(StatusCodes.NOT_FOUND, "User not found!")
  }

  if( ! isUserExist.isVerified ){
    throw new AppError(StatusCodes.BAD_REQUEST, "User is not verified!")
  }

  if( isUserExist.isActive !== IsActive.ACTIVE ){
    throw new AppError(StatusCodes.BAD_REQUEST, `User is ${isUserExist.isActive}`)
  }
  if( isUserExist.isDelete ){
    throw new AppError(StatusCodes.BAD_REQUEST, `User is Deleted`)
  }

  const jwtPayload = {
    userId: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role
  }

  const resetToken = jwt.sign(jwtPayload, envVars.JWT_ACCESS_SECRET, {
    expiresIn: "10m"
  })

  const resetUILink = `${envVars.FRONTEND_URL}/reset-password?id=${isUserExist._id}&token=${resetToken}`

  sendEmail({
    to: isUserExist.email,
    subject: "Password Reset",
    templateName: "forgotPassword",
    templateData: {
      name: isUserExist.name,
      resetUILink
    }
  })
}

// reset password
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const resetPassword = async (payload: Record<string, any>, decodedToken: JwtPayload) => {
  if( payload.id != decodedToken.userId ){
    throw new AppError(StatusCodes.BAD_REQUEST, "User not found!")
  }

  const isUserExist = await User.findById(decodedToken.userId)
  if( !isUserExist ){
    throw new AppError(StatusCodes.BAD_REQUEST, "User not found!")
  }

  const hashedPassword = await bcrypt.hash(payload.newPassword, Number(envVars.BCRYPT_SALT_ROUND))

  isUserExist.password = hashedPassword

  await isUserExist.save()

}

export const AuthServices = {
  credentialsLogin,
  getNewAccessToken,
  changePassword,
  setPassword,
  forgotPassword,
  resetPassword
}