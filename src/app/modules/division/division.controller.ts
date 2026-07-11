import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { divisionServices } from "./division.services";
import { uploadToCloudinary } from "../../config/cloudinary.config";
import { IDivision } from "./division.interface";
import { UploadApiResponse } from "cloudinary";
import { withCloudinaryCleanup } from "../../utils/cloudinaryCleanup";

// create division controller
const createDivision = catchAsync(async (req: Request, res: Response) => {

  let uploadedImage: UploadApiResponse | null = null;

  if (req.file) {
    uploadedImage = await uploadToCloudinary(req.file.buffer, "divisions");
  }

  const payload: IDivision = {
    ...req.body,
    thumbnail: uploadedImage
      ? {
          publicId: uploadedImage.public_id,
          url: uploadedImage.secure_url,
          altText: req.body.name || "division image",
          height: uploadedImage.height,
          width: uploadedImage.width,
          format: uploadedImage.format,
        }
      : null,
  };


  const createdDivision = await withCloudinaryCleanup(uploadedImage?.public_id ?? null, () => divisionServices.createDivision(payload))

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    message: "Division created successfully",
    success: true,
    data: createdDivision,
  });
});



// update division controller
const updateDivision = catchAsync( async (req: Request, res: Response) => {

  const id = req.params.id as string

  let uploadedImage : UploadApiResponse | null = null
  if( req.file ){
    uploadedImage = await uploadToCloudinary(req.file.buffer, "divisions")

  }

  const payload: Partial<IDivision> = {
    ...req.body
  }

  if( uploadedImage ){
    payload.thumbnail = {
      url: uploadedImage.secure_url,
      publicId: uploadedImage.public_id,
      format: uploadedImage.format,
      height: uploadedImage.height,
      width: uploadedImage.width,
      altText: payload.name ?? "Division image"
    }
  }
  
  const updatedDevision = await withCloudinaryCleanup(
    uploadedImage?.public_id ?? null,
    () => {
      return divisionServices.updateDivision(id, payload)
    }
  )

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Division udpated successfully",
    data: updatedDevision
  })

} )


// get all divisions
const getAllDivisions = catchAsync( async (req: Request, res: Response) => {

  const allDivisions = await divisionServices.getAllDivisions()

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "All divisions",
    data: allDivisions
  })
} )


export const divisionController = {
  createDivision,
  updateDivision,
  getAllDivisions
}