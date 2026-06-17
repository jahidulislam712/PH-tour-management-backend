import { StatusCodes } from "http-status-codes"
import AppError from "../../errorHelpers/appError"
import { IUser } from "../user/user.interface"
import { User } from "../user/user.model"
import bcrypt from "bcryptjs"
import { createNewAccessTokenWithRefreshToken, createUserTokens } from "../../utils/userTokens"
import { JwtPayload } from "jsonwebtoken"
import { envVars } from "../../config/env"

// credentials login
const credentialsLogin = async (payload: Pick<IUser, "email" | "password">) => {
  const {email, password} = payload


  const user = await User.findOne({ email }).select("+password")

  if( !user ){
    throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid email or password")
  }

  const passwordMatch = await bcrypt.compare(password, user.password as string)
  
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

// reset password
const changePassword = async (oldPassword: string, newPassword: string, decodedToken: JwtPayload) => {
  const user = await User.findById(decodedToken.userId)

  if( !user ){
    throw new AppError(StatusCodes.NOT_FOUND, "User does not exist")
  }

  const isOldPasswordMatch = await bcrypt.compare(oldPassword, user.password)

  if( ! isOldPasswordMatch ){
    throw new AppError(StatusCodes.UNAUTHORIZED, "Old password doesn't match")
  }

  user.password = await bcrypt.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND))

  await user.save()
}


export const AuthServices = {
  credentialsLogin,
  getNewAccessToken,
  changePassword
}