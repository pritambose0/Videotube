import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;
  if (!content?.trim()) {
    throw new ApiError(400, "createTweet :: Content cannot be empty");
  }

  const tweet = await Tweet.create({
    content,
    owner: new mongoose.Types.ObjectId(req.user?._id),
  });

  if (!tweet) {
    throw new ApiError(400, "createTweet :: Error while creating tweet");
  }
  //   console.log("TWEET",tweet);

  res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet created successfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  if (!userId || !isValidObjectId(userId)) {
    throw new ApiError(400, "getUserTweets :: User Id is not valid");
  }

  const tweets = await Tweet.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "tweet",
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
        _id: 1,
        content: 1,
        likesCount: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
  ]);

  if (!tweets?.length) {
    throw new ApiError(404, "getUserTweets :: No tweets found for this user");
  }
  console.log("TWEETS", tweets);

  res
    .status(200)
    .json(new ApiResponse(200, tweets, "Tweets fetched successfully"));
});

const updateTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const { tweetId } = req.params;

  if (!content?.trim()) {
    throw new ApiError(400, "updateTweet :: Content cannot be empty");
  }
  if (!tweetId || !isValidObjectId(tweetId)) {
    throw new ApiError(400, "updateTweet :: Tweet Id is not valid");
  }

  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    throw new ApiError(400, "updateTweet :: Tweet not found");
  }

  if (tweet.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(
      401,
      "updateTweet :: You do not have permission to perform this action"
    );
  }
  const updatedTweet = await Tweet.findByIdAndUpdate(
    tweetId,
    { content },
    { new: true }
  );
  if (!updatedTweet) {
    throw new ApiError(400, "updateTweet :: Error while updating tweet");
  }
  //   console.log("UPDATED TWEET", updatedTweet);

  res
    .status(200)
    .json(new ApiResponse(200, updatedTweet, "Tweet updated successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  if (!tweetId || !isValidObjectId(tweetId)) {
    throw new ApiError(400, "deleteTweet :: Tweet Id is not valid");
  }

  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    throw new ApiError(400, "deleteTweet :: Tweet not found");
  }

  if (tweet.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(
      401,
      "updateTweet :: You do not have permission to perform this action"
    );
  }

  const deletedTweet = await Tweet.findByIdAndDelete(tweetId);
  if (!deletedTweet) {
    throw new ApiError(400, "deleteTweet :: Error while deleting tweet");
  }
  //   console.log("DELETED TWEET", deletedTweet);

  res
    .status(200)
    .json(new ApiResponse(200, null, "Tweet deleted successfully"));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
