import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const videoSchema = new Schema(
  {
    videoFile: {
      type: String, // cloudinarry url
      required: true,
    },
    thumbnail: {
      type: String, // cloudinarry url
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxLength: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxLength: 255,
    },
    duration: {
      type: Number, // cloudinary url
      required: true,
    },
    video: {
      type: String, // cloudinary url
      required: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);

videoSchema.plugin(mongooseAggregatePaginate);
export const video = mongoose.model("video", videoSchema);
