import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelpers/appError";
import { ITour, ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.model";
import { QueryBuilder } from "../../utils/queryBuilder";
import { tourSearchableFields } from "./tour.constant";

// create tour-type
const createTourType = async (payload: Partial<ITourType>) => {
  const { name } = payload;

  if (!name) {
    throw new AppError(StatusCodes.NOT_FOUND, "Tour-type name cannot be empty");
  }

  const isTourTypeExist = await TourType.findOne({name});

  if (isTourTypeExist) {
    throw new AppError(
      StatusCodes.CONFLICT,
      "A tour-type with this name is already exist",
    );
  }

  const tourType = await TourType.create(payload);

  return tourType;
};

// update tour-type
const updateTourType = async (id: string, payload: Partial<ITourType>) => {
  
  const isTourTypeExist = await TourType.findById(id);

  if (!isTourTypeExist) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      "No tour-type found!",
    );
  }

  const tourType = await TourType.findByIdAndUpdate(
    id,
    payload,
    {returnDocument: "after"}
  );

  return tourType;
};
// delete tour-type
const deleteTourType = async (id: string) => {
  
  const isTourTypeExist = await TourType.findById(id);

  if (!isTourTypeExist) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      "No tour-type found!",
    );
  }

  const tourType = await TourType.findByIdAndDelete(
    id,
    {lean: true}
  );

  return tourType;
};

// get all tour-types
const getAllTourType = async () => {
  const getAllTours = await TourType.find()

  return getAllTours
}

// create tour
const createTour = async (payload: Partial<ITour>) => {
  const { title } = payload;

  if (!title) {
    throw new AppError(StatusCodes.NOT_FOUND, "Tour title cannot be empty");
  }

  const isTourExist = await Tour.findOne({ title: title });

  if (isTourExist) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      "A tour with this title is already exist",
    );
  }

  const tour = await Tour.create(payload);

  return tour;
};

// get all tours
const getAllTours = async (query: Record<string, string>) => {

  const queryBulider = new QueryBuilder(Tour.find(), query)
    .filter()
    .sort()
    .paginate()
    .search(tourSearchableFields)
    .fields()

  const filter = queryBulider.getFilter()

  const [tours, total] = await Promise.all([
    queryBulider.build(),
    Tour.countDocuments(filter)
  ])

  return {
    data: tours,
    meta:{
      page: Math.max(Number(query.page) || 1, 1),
      limit: Math.max(Number(query.limit) || 6, 1),
      total,
      totalPage: Math.ceil( total / (Number(query.limit) || 6) )
    }
  }
  
};

// update tour
const updateTour = async (id:string, payload: Partial<ITour>) => {

  const isTourExist = await Tour.findById(id);

  if ( !isTourExist ) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      "No tours found!",
    );
  }

  const tour = await Tour.findByIdAndUpdate(id, payload, {returnDocument: "after"});

  return tour;
};

export const tourServices = {
  createTourType,
  createTour,
  getAllTourType,
  updateTourType,
  updateTour,
  getAllTours,
  deleteTourType
};
