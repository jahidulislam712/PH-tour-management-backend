import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelpers/appError";
import { ITour, ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.model";
import slugify from "slugify";

// create tour-type
const createTourType = async (payload: Partial<ITourType>) => {
  const { name } = payload;

  if (!name) {
    throw new AppError(StatusCodes.NOT_FOUND, "Tour-type name cannot be empty");
  }

  const isTourExist = await TourType.findOne({name});

  if (isTourExist) {
    throw new AppError(
      StatusCodes.CONFLICT,
      "A tour-type with this name is already exist",
    );
  }

  const slug = slugify(name, {
    lower: true,
    strict: true,
  });

  payload.slug = slug;

  const tourType = await TourType.create(payload);

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

  const isTourExist = await Tour.find({ title: title });

  if (isTourExist) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      "A tour with this title is already exist",
    );
  }

  const slug = slugify(title, {
    lower: true,
    strict: true,
  });

  payload.slug = slug;

  const tour = await Tour.create(payload);

  return tour;
};

export const tourServices = {
  createTourType,
  createTour,
  getAllTourType
};
