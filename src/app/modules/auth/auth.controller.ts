import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { AuthServices } from "./auth.service";
import { setAuthCookie } from "../../utils/setCookie";
import AppError from "../../errorHelpers/appError";

// credentials login
const credentialsLogin = catchAsync( async (req: Request, res: Response) => {

  const user = await AuthServices.credentialsLogin(req.body)

  setAuthCookie(res, {
    accessToken: user.accessToken,
    refreshToken: user.refreshToken,
  })

  sendResponse(res, {
    statusCode: StatusCodes.ACCEPTED,
    success: true,
    message: "User Logged In Successfully",
    data: user
  })

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

  await AuthServices.changePassword(oldPassword, newPassword, decodedToken)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Password changed successfully",
    data: {}
  })

})

export const AuthControllers = {
  credentialsLogin,
  getNewAccessToken,
  logout,
  chagePassword
}