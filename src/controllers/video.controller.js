import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Video } from "../models/video.model.js";

const publishVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if ([title, description].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const videoFileLocalPath = req.files?.videoFile[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail[0]?.path;

  if (!videoFileLocalPath) throw new ApiError(400, "Video File is required");
  if (!thumbnailLocalPath) throw new ApiError(400, "Thumbnail is required");

  const videoFile = await uploadOnCloudinary(videoFileLocalPath);
  //   console.log("VIDEO FILE", videoFile);
  if (!videoFile) throw new ApiError(400, "Cloudinary: Video File is required");

  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
  if (!thumbnail) throw new ApiError(400, "Cloudinary: Thumbnail is required");

  const video = await Video.create({
    title,
    description,
    thumbnail: {
      url: thumbnail.url,
      publicId: thumbnail.public_id,
    },
    videoFile: {
      url: videoFile.url,
      publicId: videoFile.public_id,
    },
    duration: videoFile?.duration,
    isPublished: true,
    owner: new mongoose.Types.ObjectId(req.user?._id),
  });

  if (!video) throw new ApiError(500, "Error while uploading video");
  console.log("VIDEO", video);
  res
    .status(200)
    .json(new ApiResponse(200, video, "Video uploaded Successfully"));
});

export { publishVideo };
