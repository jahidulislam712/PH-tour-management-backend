import { Types } from "mongoose";
import { IImage } from "../division/division.interface";

export interface ITourType{
  name: string;
  slug: string;
}

export interface ITour{
  title: string;
  slug: string;
  description: string;
  images? : IImage[];
  location?: string;
  costFrom?: number;
  startDate?: Date;
  endDate?: Date;
  departureLocation?: string;
  arrivalLocation?: string;
  included?: string[];
  excluded?: string[];
  amenities?: string[];
  tourPlan?: string[];
  maxGuest?: number;
  minAge?: number;
  division?: Types.ObjectId;
  tourType?: Types.ObjectId;
}

export interface IUpdateTour extends Partial<ITour>{
  deleteImages?: string[]
}