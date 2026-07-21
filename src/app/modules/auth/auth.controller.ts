/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { AuthServices } from "./auth.service";
import { setAuthCookie } from "../../utils/setCookie";
import AppError from "../../errorHelpers/appError";
import { JwtPayload } from "jsonwebtoken";
import { createUserTokens } from "../../utils/userTokens";
import { envVars } from "../../config/env";
import passport from "passport";

// credentials login
const credentialsLogin = catchAsync( async (req: Request, res: Response, next: NextFunction) => {

  //const user = await AuthServices.credentialsLogin(req.body)
  // setAuthCookie(res, {
  //   accessToken: user.accessToken,
  //   refreshToken: user.refreshToken,
  // })
  
  passport.authenticate('local',
    async (err: any, user: any, info: any) => {

      if( err ){
        return next(new AppError(err.statusCode, err.message))
      }

      if( !user ){
        return next(new AppError(401, info.message))
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {password: pass, ...rest} = user.toObject()

      const userTokens = await createUserTokens(user)

      setAuthCookie(res, userTokens)

      sendResponse(res, {
        statusCode: StatusCodes.ACCEPTED,
        success: true,
        message: "User Logged In Successfully",
        data: {
          accessToken: userTokens.accessToken,
          refreshToken: userTokens.refreshToken,
          user: rest
        }
      })

    }
  )(req, res, next)

} )

// get new access token from refreshToken
const getNewAccessToken = catchAsync ( async (req: Request, res: Response) => {
  
  const refreshToken = req.cookies.refreshToken;


  if( !refreshToken ){
    throw new AppError(StatusCodes.NOT_FOUND, "refreshToken not found to generate new access token")
  }
  const tokenInfo = await AuthServices.getNewAccessToken(refreshToken  as string)

  setAuthCookie(res, tokenInfo)

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "New access token retrived successfully",
    data: tokenInfo
  })
})

// user logged out
const logout = catchAsync( async (req: Request, res: Response) => {
  res.clearCookie('accessToken', {
    httpOnly: true,
    secure: false,
    sameSite: "lax"
  })
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: false,
    sameSite: "lax"
  })

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User logged out successfully",
    data:{}
  })
})

// change password
const chagePassword = catchAsync(async (req: Request, res: Response) => {

  const {oldPassword, newPassword} = req.body
  const decodedToken = req.user

  await AuthServices.changePassword(oldPassword, newPassword, decodedToken as JwtPayload)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Password changed successfully",
    data: {}
  })

})

// set password after google login
const setPassword = catchAsync( async (req: Request, res: Response) => {

  const decodedToken = req.user as JwtPayload
  const { password } = req.body
  
  await AuthServices.setPassword(decodedToken.userId, password)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Password has changed successfully",
    data: null
  })
})

// forgot password
const forgotPassword = catchAsync( async(req: Request, res: Response) => {
  const { email } = req.body
  AuthServices.forgotPassword(email)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Email sent successfully",
    data: null
  })

} )

// reset password
const resetPassword = catchAsync( async(req: Request, res: Response) => {

  const decodedToken = req.user as JwtPayload

  AuthServices.resetPassword(req.body, decodedToken)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Password Changed successfully",
    data: null
  })

} )

// google callback controler
const googleCallback = catchAsync( async(req: Request, res: Response) => {
  let redirectTo = req.query.state ? req.query.state as string : ""
  if( redirectTo.startsWith("/") ){
    redirectTo = redirectTo.slice(1)
  }

  const user = req.user;

  if( !user ){
    throw new AppError(StatusCodes.NOT_FOUND, "User not found!!")
  }

  const tokenInfo = createUserTokens(user)
  setAuthCookie(res, tokenInfo)

  res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`)

} )

export const AuthControllers = {
  credentialsLogin,
  getNewAccessToken,
  logout,
  chagePassword,
  setPassword,
  googleCallback,
  forgotPassword,
  resetPassword
}