import { model, Schema } from "mongoose";
import { IDivision, IImage } from "./division.interface";

export const imageSchema = new Schema<IImage>({
  url: {type: String, required: true},
  publicId: {type: String, required: true},
  altText: {type: String},
  height: {type: Number},
  width: {type: Number},
  format: {type: String}
}, {
  versionKey: false,
  _id: false
})

const divisionSchema = new Schema<IDivision>(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, unique: true },
    thumbnail: {
      type: [imageSchema],
      default: null
    },
    description: { type: String, default: null },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const Division = model<IDivision>("Division", divisionSchema);

export default Division;
