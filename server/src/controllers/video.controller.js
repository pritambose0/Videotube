import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
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
        $or: [{ title: { $regex: query, $options: "i" } }],
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
  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Videos fetched successfully"));
});

const getAllRecommendedVideos = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const video = await Video.findById(videoId);

  const { title, description } = video;
  const titleKeywords = title?.split(" ");
  const descriptionKeywords = description?.split(" ").slice(0, 10);

  const keywords = [
    ...new Set([...titleKeywords, ...descriptionKeywords]),
  ].join("|");

  const recommendedVideos = await Video.find({
    _id: { $ne: videoId },
    $or: [
      { title: { $regex: keywords, $options: "i" } },
      { description: { $regex: keywords, $options: "i" } },
    ],
  })
    .populate("owner", "fullName avatar")
    .limit(10);

  // console.log("Recommended Videos", recommendedVideos);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        recommendedVideos,
        "Recommended videos fetched successfully"
      )
    );
});

const publishVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!title) {
    throw new ApiError(400, "All fields are required");
  }

  const videoFileLocalPath = req.files?.videoFile[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail[0]?.path;

  if (!videoFileLocalPath) throw new ApiError(400, "Video File is required");
  if (!thumbnailLocalPath) throw new ApiError(400, "Thumbnail is required");

  const videoFile = await uploadOnCloudinary(videoFileLocalPath);
  // console.log("VIDEO FILE", videoFile);
  if (!videoFile) throw new ApiError(400, "Cloudinary: Video File is required");

  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
  if (!thumbnail) throw new ApiError(400, "Cloudinary: Thumbnail is required");

  const video = await Video.create({
    title: title || "",
    description: description || "",
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
  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video uploaded Successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) throw new ApiError(404, "Video not found");
  // console.log("USER: ", req.user);

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
            if: { $in: [req.user?._id, "$likes.likedBy"] },
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
      $unwind: "$owner",
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
  // console.log("VIDEO", video);
  return res
    .status(200)
    .json(new ApiResponse(200, video[0], "Video fetched successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  const { videoId } = req.params;
  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiError(400, "VideoId not found");
  }

  const video = await Video.findById(videoId);
  if (!video) throw new ApiError(404, "Video not found");

  if (req.user?._id.toString() !== video?.owner._id.toString()) {
    throw new ApiError(
      401,
      "You do not have permission to perform this action"
    );
  }

  const thumbnailLocalPath = req.file?.path;

  let thumbnail;
  if (thumbnailLocalPath) {
    thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    if (!thumbnail) {
      throw new ApiError(400, "Error while uploading thumbnail on Cloudinary");
    }
  }

  const updatedVideo = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        title: title || video?.title,
        description: description || video?.description,
        thumbnail: thumbnail
          ? {
              url: thumbnail.url,
              publicId: thumbnail.public_id,
            }
          : video?.thumbnail,
      },
    },
    { new: true }
  );

  if (!updatedVideo) {
    throw new ApiError(400, "Error while updating video");
  }

  if (thumbnail && video?.thumbnail?.publicId) {
    const deleteOldThumbnail = await deleteFromCloudinary(
      video.thumbnail.publicId
    );
    if (!deleteOldThumbnail) {
      throw new ApiError(
        500,
        "Error while deleting old thumbnail from Cloudinary"
      );
    }
  }

  // console.log("VIDEO UPDATED", updatedVideo);
  return res
    .status(200)
    .json(new ApiResponse(200, updatedVideo, "Video updated successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiError(400, "deleteVideo :: Error while getting videoId");
  }

  const video = await Video.findById(videoId);
  if (!video) throw new ApiError(404, "Video not found");

  if (req.user?._id.toString() !== video?.owner._id.toString()) {
    throw new ApiError(
      401,
      "deleteVideo :: You do not have permission to perform this action"
    );
  }
  const deletedVideo = await Video.findByIdAndDelete(videoId);
  const delVideoFile = await deleteFromCloudinary(video?.videoFile?.publicId);
  const delThumbnail = await deleteFromCloudinary(video?.thumbnail?.publicId);

  if (!delVideoFile || !delThumbnail) {
    throw new ApiError(
      500,
      "deleteVideo :: Error while deleting video from Cloudinary"
    );
  }
  // console.log("DELETED VIDEO", deletedVideo);
  return res
    .status(200)
    .json(new ApiResponse(200, deletedVideo, "Video deleted successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiResponse(400, "togglePublishVideo :: Video id is not valid");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "togglePublishVideo :: Video not found");
  }

  if (req.user?._id.toString() !== video?.owner._id.toString()) {
    throw new ApiError(
      401,
      "togglePublishVideo :: You do not have permission to perform this action"
    );
  }

  const updatedVideo = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: { isPublished: !video?.isPublished },
    },
    {
      new: true,
    }
  );
  // console.log("TOGGLE STATUS: ", updatedVideo);

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedVideo, "Publish status toggled successfully")
    );
});

export {
  publishVideo,
  getAllVideos,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
  getAllRecommendedVideos,
};
