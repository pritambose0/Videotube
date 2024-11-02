import mongoose, { Schema } from "mongoose";

import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
  {
    videoFile: {
      url: {
        type: String, //cloudinary url
        required: true,
      },
      publicId: {
        type: String,
        required: true,
      },
    },
    thumbnail: {
      url: {
        type: String, //cloudinary url
        required: true,
      },
      publicId: {
        type: String,
        required: true,
      },
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    duration: {
      type: Number, //cloudinary
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model("Video", videoSchema);
