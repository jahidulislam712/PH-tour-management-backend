import { Error } from "mongoose";
import { TErrorSources, TGenericErrorResponse } from "../interfaces/error.types";


export const handleValidationError = (err: Error.ValidationError): TGenericErrorResponse => {

  const errorSources: TErrorSources[] = []

  const errors = Object.values(err.errors)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors.forEach((error: any) => errorSources.push({    
    path: error.path,
    message: error.message
  }));
  
  return {
    statusCode: 400,
    message: "Validation Error",
    errorSources
  }
}