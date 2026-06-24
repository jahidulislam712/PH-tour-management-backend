import { NextFunction, Request, Response } from "express"
import { verifyToken } from "../utils/jwt"
import { envVars } from "../config/env"
import AppError from "../errorHelpers/appError"
import { StatusCodes } from "http-status-codes"
import { JwtPayload } from "jsonwebtoken"
import { User } from "../modules/user/user.model"
import { IsActive } from "../modules/user/user.interface"

export const checkAuth = (...authRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken = req.headers.authorization

    if (!accessToken){
      throw new AppError(StatusCodes.UNAUTHORIZED, "Authentication token is missing.")
    }

    const verifiedToken = verifyToken(accessToken, envVars.JWT_ACCESS_SECRET) as JwtPayload

    const isUserExist = await User.findById(verifiedToken.userId)

    if( !isUserExist ){
      throw new AppError(StatusCodes.NOT_FOUND, "User not found")
    }

    if( isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE ){
      throw new AppError(StatusCodes.NOT_FOUND, `User is ${isUserExist.isActive}`)
    }

    if( isUserExist.isDelete ){
      throw new AppError(StatusCodes.NOT_FOUND, `User is deleted}`)
    }

    if( !authRoles.includes(verifiedToken.role) ){
      throw new AppError( StatusCodes.UNAUTHORIZED, "You are not permitted to view this route.")
    }

    req.user = verifiedToken

    next()
  } catch (err) {
    next(err)
  }
}