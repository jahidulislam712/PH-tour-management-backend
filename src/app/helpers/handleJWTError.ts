import { TGenericErrorResponse } from "../interfaces/error.types";

export const handleJWTError = (): TGenericErrorResponse => {
  return {
    statusCode: 400,
    message: "Invalid token. Please login again."
  }
}