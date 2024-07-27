import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    query = "",
    sortBy = "createdAt",
    sortType = "desc",
  } = req.query;

  const skip = (page - 1) * limit;

  const videos = await Video.aggregate([
    {
      $match: {
        $or: [
          { title: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
        ],
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              avatar: 1,
              username: 1,
              fullName: 1,
            },
          },
        ],
      },
    },
    {
      $project: {
        _id: 1,
        owner: 1,
        "videoFile.url": 1,
        "thumbnail.url": 1,
        createdAt: 1,
        title: 1,
        duration: 1,
        views: 1,
      },
    },
    {
      $sort: {
        [sortBy]: sortType === "asc" ? 1 : -1,
      },
    },
    { $limit: limit * 1 },
    { $skip: skip },
  ]);

  // console.log("VIDEOS: ", videos);
  res
    .status(200)
    .json(new ApiResponse(200, videos, "Videos fetched successfully"));
});

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
  //   console.log("VIDEO", video);
  res
    .status(200)
    .json(new ApiResponse(200, video, "Video uploaded Successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) throw new ApiError(404, "Video not found");

  const video = await Video.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(videoId),
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "video",
        as: "likes",
      },
    },
    {
      $addFields: {
        likesCount: {
          $size: "$likes",
        },
        isLiked: {
          $cond: {
            if: { $in: [req.user?._id, "$likes"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $lookup: {
              from: "subscriptions",
              localField: "_id",
              foreignField: "channel",
              as: "subscribers",
            },
          },
          {
            $addFields: {
              // These will include in this stage
              subscriberCount: {
                $size: "$subscribers",
              },

              isSubscribed: {
                $cond: {
                  if: { $in: [req.user?._id, "$subscribers.subscriber"] },
                  then: true,
                  else: false,
                },
              },
            },
          },
          {
            $project: {
              fullName: 1,
              username: 1,
              subscriberCount: 1,
              isSubscribed: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "video",
        as: "comments",
      },
    },
    {
      $project: {
        "videoFile.url": 1,
        "thumbnail.url": 1,
        title: 1,
        description: 1,
        duration: 1,
        views: 1,
        createdAt: 1,
        likesCount: 1,
        isLiked: 1,
        comments: 1,
        owner: 1,
      },
    },
  ]);

  if (!video) throw new ApiError(404, "Video not found");

  await Video.findByIdAndUpdate(videoId, {
    $inc: {
      views: 1,
    },
  });

  await User.findByIdAndUpdate(req.user?._id, {
    $addToSet: {
      watchHistory: videoId,
    },
  });
  console.log("VIDEO", video);
  res
    .status(200)
    .json(new ApiResponse(200, video, "Video fetched successfully"));
});

export { publishVideo, getAllVideos, getVideoById };
