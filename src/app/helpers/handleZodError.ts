import { TErrorSources, TGenericErrorResponse } from "../interfaces/error.types"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleZodError = (err: any): TGenericErrorResponse => {

  const errorSources: TErrorSources[] = []
  const errors = err.issues

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors.forEach((error: any) => errorSources.push({
    path: error.path.join('.'),
    message: error.message
  })) 

  return{
    statusCode: 400,
    message: "Validation Error!",
    errorSources
  }
}