import mongoose, { isValidObjectId } from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiError(400, "getVideoComments :: Video Id is not valid");
  }

  const comments = await Comment.aggregate([
    {
      $match: {
        video: new mongoose.Types.ObjectId(videoId),
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
              _id: 1,
              username: 1,
              avatar: 1,
              fullName: 1,
            },
          },
        ],
      },
    },
    // This step converts the owner array into an object
    {
      $unwind: "$owner",
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "comment",
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
      $project: {
        _id: 1,
        createdAt: 1,
        username: 1,
        avatar: 1,
        likesCount: 1,
        isLiked: 1,
        content: 1,
        owner: 1,
      },
    },
    {
      $skip: (parseInt(page) - 1) * limit,
    },
    {
      $limit: parseInt(limit),
    },
  ]);

  const totalComments = await Comment.countDocuments({ video: videoId });
  // console.log("COMMENTS", comments);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { comments, totalComments },
        "Comments fetched successfully"
      )
    );
});

const addComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const { videoId } = req.params;

  if (!content?.trim()) {
    throw new ApiError(400, "addComment :: Comment cannot be empty");
  }
  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiError(400, "addComment :: Video Id is not valid");
  }

  const comment = await Comment.create({
    content,
    video: new mongoose.Types.ObjectId(videoId),
    owner: new mongoose.Types.ObjectId(req.user?._id),
  });

  if (!comment) {
    throw new ApiError(400, "addComment :: Error while adding comment");
  }
  // console.log("COMMENT", comment);

  return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment added successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const { commentId } = req.params;

  if (!commentId || !isValidObjectId(commentId)) {
    throw new ApiError(400, "updateComment :: Comment Id is not valid");
  }
  if (!content?.trim()) {
    throw new ApiError(400, "Comment cannot be empty");
  }
  const comment = await Comment.findById(commentId);
  if (req.user?._id.toString() !== comment.owner.toString()) {
    throw new ApiError(
      401,
      "updateComment :: You do not have permission to perform this action"
    );
  }

  const updatedComment = await Comment.findByIdAndUpdate(
    commentId,
    {
      $set: { content },
    },
    {
      new: true,
    }
  );

  if (!updateComment) {
    throw new ApiError(400, "updateComment :: Error while updating comment");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedComment, "Comment updated"));
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!commentId || !isValidObjectId(commentId)) {
    throw new ApiError(400, "updateComment :: Comment Id is not valid");
  }
  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(400, "deleteComment :: Comment not found");
  }

  if (req.user?._id.toString() !== comment.owner.toString()) {
    throw new ApiError(
      401,
      "updateComment :: You do not have permission to perform this action"
    );
  }

  const deletedComment = await Comment.findByIdAndDelete(commentId);
  if (!deletedComment) {
    throw new ApiError(400, "deleteComment :: Error while deleting comment");
  }
  console.log("DELETED COMMENT", deletedComment);
  return res
    .status(200)
    .json(new ApiResponse(200, deletedComment, "Comment deleted"));
});

export { getVideoComments, addComment, updateComment, deleteComment };
