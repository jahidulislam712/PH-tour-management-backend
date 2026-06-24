import { StatusCodes } from "http-status-codes"
import AppError from "../../errorHelpers/appError"
import { IDivision } from "./division.interface"
import Division from "./division.model"
import slugify from "slugify"

// create division
const createDivision = async (payload: Partial<IDivision>) => {

  const { name } = payload

  if( !name ){
    throw new AppError(StatusCodes.NOT_ACCEPTABLE, "Division name cannot be empty")
  }

  const isDivisionExist = await Division.findOne({name})

  if( isDivisionExist ){
    throw new AppError(StatusCodes.NOT_ACCEPTABLE, "A division with this name is already exists.")
  }

  const slug = `${slugify(name, {
    lower: true,
    strict: true
  })}-division`

  payload.slug = slug
  
  const division = await Division.create(payload)

  return division

}

// get all divisions
const getAllDivisions = async () => {

  const allDivision = await Division.find()

  return allDivision

}

// update division
const updateDivision = async (id: string, payload: Partial<IDivision>) => {

  const isDivisionExist = await Division.findById(id)
  if( !isDivisionExist ){
    throw new AppError(StatusCodes.NOT_FOUND, "Division not found!")
  }

  const duplicateDivision = await Division.findOne({
    _id: { $ne: id },
    name: payload.name as string
  })

  if( duplicateDivision ){
    throw new AppError(StatusCodes.BAD_REQUEST, "A division with this name already exists.")
  }

  const updateDivision = await Division.findByIdAndUpdate(id, payload, {returnDocument: "after"})

  return updateDivision

}

export const divisionServices = {
  createDivision,
  updateDivision,
  getAllDivisions
}