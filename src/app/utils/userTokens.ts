import { JwtPayload } from "jsonwebtoken"
import { envVars } from "../config/env"
import { IsActive, IUser } from "../modules/user/user.interface"
import { generateToken, verifyToken } from "./jwt"
import { User } from "../modules/user/user.model"
import AppError from "../errorHelpers/appError"
import { StatusCodes } from "http-status-codes"

export const createUserTokens = (user: Partial<IUser>) => {
  const jwtPayload = {
    userId: user._id,
    role: user.role,
    email: user.email
  }
  const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)
  const refreshToken = generateToken(jwtPayload, envVars.JWT_REFRESH_SECRET, envVars.JWT_REFRESH_EXPIRES)

  return {
    accessToken,
    refreshToken
  }
}

export const createNewAccessTokenWithRefreshToken = async (refreshToken: string) => {
  const verifiedRefreshToken = verifyToken(refreshToken, envVars.JWT_REFRESH_SECRET) as JwtPayload

  const user = await User.findOne({id: verifiedRefreshToken._id})

  if( !user ){
    throw new AppError(StatusCodes.NOT_FOUND, "User doen not exist.")
  }

  if( user.isActive === IsActive.BLOCKED ){
    throw new AppError(StatusCodes.FORBIDDEN, "User is blocked")
  }

  if( user.isActive === IsActive.INACTIVE ){
    throw new AppError(StatusCodes.FORBIDDEN, "User is inactive")
  }

  const jwtPayload = {
    userId: user._id,
    email: user.email,
    role: user.role
  }
  const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)

  return accessToken
}