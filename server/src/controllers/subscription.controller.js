import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!channelId || !isValidObjectId(channelId)) {
    throw new ApiError(400, "toggleSubscription :: Channel id is not valid");
  }
  // console.log("CHANNEL ID", channelId);
  const existingSubscriptionStatus = await Subscription.findOne({
    subscriber: req.user?._id,
    channel: channelId,
  });

  if (existingSubscriptionStatus) {
    // if subscribed then remove subscription
    const unsubscribe = await Subscription.findByIdAndDelete(
      existingSubscriptionStatus
    );
    if (!unsubscribe) {
      throw new ApiError(
        500,
        "toggleSubscription :: Error while unsubscribing"
      );
    }
  } else {
    // if not subscribed then add subscription
    const subscribe = await Subscription.create({
      subscriber: req.user?._id,
      channel: channelId,
    });
    if (!subscribe) {
      throw new ApiError(500, "toggleSubscription :: Error while subscribing");
    }
  }
  const subscribers = await Subscription.find({
    channel: channelId,
  }).countDocuments();
  // console.log(subscribers);

  // console.log("SUBSCRIPTION STATUS", existingSubscriptionStatus);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        subscribers: subscribers,
        isSubscribed: !existingSubscriptionStatus,
      },
      "Subscription toggled"
    )
  );
});

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  // console.log("CHANNEL ID", channelId);

  if (!channelId || !isValidObjectId(channelId)) {
    throw new ApiError(
      400,
      "getUserChannelSubscribers :: Channel id is not valid"
    );
  }

  const subscribers = await Subscription.aggregate([
    {
      $match: {
        channel: new mongoose.Types.ObjectId(channelId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "channel",
        foreignField: "_id",
        as: "subscribers", // here we can use further pipeline too for more details
      },
    },
    {
      $addFields: {
        subscribersCount: {
          $size: "$subscribers",
        },
      },
    },
    {
      $project: {
        _id: 0,
        subscribersCount: 1,
        "subscribers._id": 1,
        "subscribers.username": 1,
        "subscribers.avatar": 1,
        "subscribers.fullName": 1,
      },
    },
  ]);

  if (!subscribers) {
    throw new ApiError(
      404,
      "getUserChannelSubscribers :: No subscribers found"
    );
  }
  // console.log("SUBSCRIBERS", subscribers);
  return res
    .status(200)
    .json(new ApiResponse(200, subscribers[0], "Subscribers fetched"));
});

const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { username } = req.params;

  if (!username) {
    throw new ApiError(400, "Username is not valid");
  }
  const user = await User.findOne({ username });
  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const subscribedChannels = await Subscription.aggregate([
    {
      $match: {
        subscriber: new mongoose.Types.ObjectId(user._id),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "channel",
        foreignField: "_id",
        as: "channels",
        pipeline: [
          {
            $lookup: {
              from: "subscriptions",
              localField: "_id",
              foreignField: "subscriber",
              as: "subscribers",
            },
          },
          {
            $addFields: {
              subscriberCount: {
                $size: "$subscribers",
              },
            },
          },
          {
            $project: {
              _id: 1,
              username: 1,
              fullName: 1,
              "avatar.url": 1,
              subscriberCount: 1,
            },
          },
        ],
      },
    },
    { $unwind: "$channels" },
    {
      $replaceRoot: {
        newRoot: "$channels", // Replaces the root with the channel object, effectively removing nesting
      },
    },
  ]);

  // console.log("SUBSCRIBED CHANNELS", subscribedChannels);

  return res
    .status(200)
    .json(new ApiResponse(200, subscribedChannels, "Channels fetched"));
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
