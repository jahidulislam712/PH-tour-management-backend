import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelpers/appError";
import { sendEmail } from "../../utils/sendEmail";
import { User } from "../user/user.model";
import crypto from "crypto";
import { redisClient } from "../../config/redis.config";
const OTP_EXPIRATION = 2 * 60;

const generateOtp = (length = 6) => {
  const otp = crypto.randomInt( 10 ** (length - 1), 10 ** length).toString()
  return otp
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sendOTP = async (payload: Record<string, any>) => {
  const { name, email } = payload;

  const isUserExist = await User.findOne({ email });

  if( !isUserExist ){
    throw new AppError(StatusCodes.NOT_FOUND, "User doesn't exist.")
  }

  if( isUserExist.isVerified ){
    throw new AppError(StatusCodes.NOT_FOUND, "User already verified")
  }

  const otp = generateOtp();

  await redisClient.set(`otp:${email}`, otp, {
    expiration: {
      type: "EX",
      value: OTP_EXPIRATION
    }
  })

  sendEmail({
    to: email,
    subject: "Account verification OTP",
    templateName: "verify-account",
    templateData: {
      name,
      otp: otp
    }
  })
}

// verify OTP
const verifyOTP = async (email: string, otp: string) => {

  const isUserExist = await User.findOne({email})
  if( !isUserExist ) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User doesn't exist!")
  }

  const redisKey = `otp:${email}`

  const redisOtp = await redisClient.get(redisKey)

  if( !redisOtp ){
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid OTP")
  }

  if( otp !== redisOtp ){
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid OTP")
  }

  isUserExist.isVerified = true
  await isUserExist.save()

  await redisClient.del(redisKey)

}

export const OTPServices = {
  sendOTP,
  verifyOTP
};
