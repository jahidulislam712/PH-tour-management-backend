import { model, Schema } from "mongoose";
import { ITour, ITourType } from "./tour.interface";
import slugify from "slugify";

/**========================
 * TourType Schema
 ========================*/
export const tourTypeSchema = new Schema<ITourType>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// generate / create slug before creating the tour-type
tourTypeSchema.pre("save", async function () {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true,
    });
  }
});

// regenerate while updating the tour-type
tourTypeSchema.pre(["findOneAndUpdate", "updateOne"], async function () {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const update = this.getUpdate() as any;
  const name = update?.name || update?.$set?.name;
  if (name) {
    if (update.$set) {
      update.$set.slug = slugify(name, {
        lower: true,
        strict: true,
      });
    } else {
      update.slug = slugify(name, {
        lower: true,
        strict: true,
      });
    }
  }
});

export const TourType = model<ITourType>("TourType", tourTypeSchema);

/**========================
 * Tour Schema
 ========================*/
export const tourSchema = new Schema<ITour>(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
    },
    images: {
      type: [String],
      default: [],
    },
    location: { type: String },
    costFrom: { type: Number },
    startDate: { type: Date },
    endDate: { type: Date },
    departureLocation: { type: String },
    arrivalLocation: { type: String },
    included: {
      type: [String],
      default: [],
    },
    excluded: {
      type: [String],
      default: [],
    },
    amenities: {
      type: [String],
      default: [],
    },
    tourPlan: {
      type: [String],
      default: [],
    },
    maxGuest: Number,
    minAge: Number,
    division: {
      type: Schema.Types.ObjectId,
      ref: "Division",
      required: true,
    },
    tourType: {
      type: Schema.Types.ObjectId,
      ref: "TourType",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// generate / create slug before creating the tour
tourSchema.pre("save", async function () {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, {
      strict: true,
      lower: true,
    });
  }
});
// update slug before updating the tour
tourSchema.pre(["updateOne", "findOneAndUpdate"], async function () {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const payload = this.getUpdate() as any;
  const title = payload?.title || payload?.$set?.title;
  if (title) {
    payload.slug = slugify(title, {
      strict: true,
      lower: true,
    });
  }
});

export const Tour = model<ITour>("Tour", tourSchema);
