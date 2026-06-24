import { model, Schema } from "mongoose";
import { IDivision } from "./division.interface";

const divisionSchema = new Schema<IDivision>(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, unique: true },
    thumbnail: { type: String, default: null },
    description: { type: String, default: null },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const Division = model<IDivision>("Division", divisionSchema);

export default Division;
