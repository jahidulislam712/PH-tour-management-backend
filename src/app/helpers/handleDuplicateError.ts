import { TGenericErrorResponse } from "../interfaces/error.types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleDuplicateError = (err: any): TGenericErrorResponse => {

  const field = Object.keys(err.keyValue || {})[0];
  const message = `${field} is already exists`

  return {
    statusCode: 400,
    message,
  }
}