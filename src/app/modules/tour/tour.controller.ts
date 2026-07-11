import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { tourServices } from "./tour.service";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { UploadApiResponse } from "cloudinary";
import { uploadToCloudinary } from "../../config/cloudinary.config";
import { ITour } from "./tour.interface";


/** ================================
 *      Tour-Type
 ================================ */
// create tour-type
const createTourType = catchAsync( async (req: Request, res: Response) => {
  
  const tourType = await tourServices.createTourType(req.body)

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "Tour-type created successfully",
    data: tourType
  })

} )

// create tour-type
const updateTourType = catchAsync( async (req: Request, res: Response) => {
  
  const tourType = await tourServices.updateTourType(req.params.id as string, req.body)

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Tour-type updated successfully",
    data: tourType
  })

} )

// delete tour-type
const deleteTourType = catchAsync( async (req: Request, res: Response) => {
  
  const tourType = await tourServices.deleteTourType(req.params.id as string)

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Tour-type deleted successfully",
    data: tourType
  })

} )

// get all tour-types
const getAllTourType = catchAsync( async(req: Request, res: Response) => {
  const result = await tourServices.getAllTourType()

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "All tour-types",
    data: result
  })
} )


/** ================================
 *      Tour
 ================================ */
const createTour = catchAsync( async (req: Request, res: Response) => {

  const uploadImages: UploadApiResponse[] = []
  if( req.files ){
    for(const file of req.files as Express.Multer.File[]){
      const image = await uploadToCloudinary(file.buffer, "tours")
      uploadImages.push(image)
    }
  }

  const payload: Partial<ITour> = {
    ...req.body 
  }

  if( uploadImages.length ){
    payload.images = uploadImages.map((image) => ({
      url: image.secure_url,
      publicId: image.public_id,
      altText: req.body.title,
      format: image.format,
      height: image.height,
      width: image.width
    }))
  }

  const tour = await tourServices.createTour(payload)

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "Tour created successfully",
    data: tour
  })

} )


const getAllTours = catchAsync( async (req: Request, res: Response) => {

  const query = req.query as Record<string, string>

  const result = await tourServices.getAllTours(query)

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "All tours",
    meta: result.meta,
    data: result.data,
  })

} )


const updateTour = catchAsync( async (req: Request, res: Response) => {

  const uploadedImages: UploadApiResponse[] = []

  if( req.files ){
    for(const file of req.files as Express.Multer.File[]){
      const image = await uploadToCloudinary(file.buffer, "tours")
      uploadedImages.push(image)
    }
  }

  const tour = await tourServices.updateTour(req.params.id as string, req.body, uploadedImages)

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Tour updated successfully",
    data: tour
  })

} )

export const tourControllers = {
  createTourType,
  createTour,
  getAllTourType,
  updateTourType,
  updateTour,
  getAllTours,
  deleteTourType
}