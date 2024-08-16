import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiError(400, "toggleVideoLike :: video id is not valid");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "toggleVideoLike :: Video not found");
  }

  const existingLikeStatus = await Like.findOne({
    video: new mongoose.Types.ObjectId(videoId),
    likedBy: new mongoose.Types.ObjectId(req.user?._id),
  });

  // If already liked
  if (existingLikeStatus) {
    //Remove Like
    const disliked = await Like.findByIdAndDelete(existingLikeStatus._id);
    if (!disliked)
      throw new ApiError(500, "toggleVideoLike :: Error while removing like");
  } else {
    const liked = await Like.create({
      // Add Like
      video: new mongoose.Types.ObjectId(videoId),
      likedBy: new mongoose.Types.ObjectId(req.user?._id),
    });
    if (!liked) {
      throw new ApiError(500, "toggleVideoLike :: Error while adding like");
    }
  }

  const likes = await Video.aggregate([
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
      },
    },
    {
      $project: {
        likesCount: 1,
      },
    },
  ]);
  // console.log("LIKES", likes[0].likesCount);

  // console.log("EXISTING", existingLikeStatus);
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { isLiked: !existingLikeStatus, likes: likes[0].likesCount },
        "Like Status Updated"
      )
    );
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!commentId || !isValidObjectId(commentId)) {
    throw new ApiError(400, "toggleCommentLike :: Comment id is not valid");
  }

  const existingLikeStatus = await Like.findOne({
    comment: new mongoose.Types.ObjectId(commentId),
    likedBy: new mongoose.Types.ObjectId(req.user?._id),
  });
  // If already liked
  if (existingLikeStatus) {
    //Remove Like
    const disliked = await Like.findByIdAndDelete(existingLikeStatus._id);
    if (!disliked)
      throw new ApiError(500, "toggleCommentLike :: Error while removing like");
  } else {
    const liked = await Like.create({
      // Add Like
      comment: new mongoose.Types.ObjectId(commentId),
      likedBy: new mongoose.Types.ObjectId(req.user?._id),
    });
    if (!liked) {
      throw new ApiError(500, "toggleCommentLike :: Error while adding like");
    }
  }
  console.log("EXISTING", existingLikeStatus);

  res
    .status(200)
    .json(new ApiResponse(200, existingLikeStatus, "Like Status Updated"));
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  if (!tweetId || !isValidObjectId(tweetId)) {
    throw new ApiError(400, "toggleTweetLike :: Tweet id is not valid");
  }

  const existingLikeStatus = await Like.findOne({
    tweet: new mongoose.Types.ObjectId(tweetId),
    likedBy: new mongoose.Types.ObjectId(req.user?._id),
  });
  // If already liked
  if (existingLikeStatus) {
    //Remove Like
    const disliked = await Like.findByIdAndDelete(existingLikeStatus._id);
    if (!disliked)
      throw new ApiError(500, "toggleTweetLike :: Error while removing like");
  } else {
    const liked = await Like.create({
      // Add Like
      tweet: new mongoose.Types.ObjectId(tweetId),
      likedBy: new mongoose.Types.ObjectId(req.user?._id),
    });
    if (!liked) {
      throw new ApiError(500, "toggleTweetLike :: Error while adding like");
    }
  }
  console.log("EXISTING", existingLikeStatus);

  res
    .status(200)
    .json(new ApiResponse(200, existingLikeStatus, "Like Status Updated"));
});

const getLikedVideos = asyncHandler(async (req, res) => {
  const likedVideos = await Like.aggregate([
    {
      $match: {
        likedBy: new mongoose.Types.ObjectId(req.user?._id),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "video",
      },
    },
    {
      $unwind: "$video",
    },
    {
      $project: {
        video: 1,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "video.owner",
        foreignField: "_id",
        as: "owner",
      },
    },
    {
      $unwind: "$owner",
    },
    {
      $project: {
        video: 1,
      },
    },
    {
      $project: {
        _id: 1,
        "owner.username": 1,
        "owner._id": 1,
        "owner.avatar.url": 1,
        "videos.videoFile.url": 1,
        "videos.thumbnail.url": 1,
        "videos.views": 1,
        "videos.duration": 1,
        "videos.title": 1,
        "videos.createdAt": 1,
      },
    },
  ]);

  if (!likedVideos?.length) {
    throw new ApiError(
      500,
      "getLikedVideos :: No liked videos found for this user"
    );
  }
  console.log("LIKED VIDEOS", likedVideos);

  res.status(200).json(new ApiResponse(200, likedVideos, "Liked Videos Found"));
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
