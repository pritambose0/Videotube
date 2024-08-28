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
  console.log(subscribers);

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

// controller to return subscriber list of a channel
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
        localField: "subscriber",
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
        subscribersCount: 1,
        subscribers: {
          _id: 1,
          username: 1,
          avatar: 1,
          fullName: 1,
        },
      },
    },
  ]);

  if (!subscribers) {
    throw new ApiError(404, "getUserChannelSubscribers :: Channel not found");
  }
  // console.log("SUBSCRIBERS", subscribers);
  return res
    .status(200)
    .json(new ApiResponse(200, subscribers, "Subscribers fetched"));
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!channelId || !isValidObjectId(channelId)) {
    throw new ApiError(400, "getSubscribedChannels :: Channel id is not valid");
  }

  const subscribedChannels = await Subscription.aggregate([
    {
      $match: {
        subscriber: new mongoose.Types.ObjectId(subscriberId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "channel",
        foreignField: "_id",
        as: "channels",
      },
    },
    {
      $addFields: {
        channelsCount: {
          $size: "$channels",
        },
      },
    },
    {
      $project: {
        channelsCount: 1,
        channels: {
          _id: 1,
          username: 1,
          avatar: 1,
        },
      },
    },
  ]);

  if (!subscribedChannels) {
    throw new ApiError(404, "getSubscribedChannels :: Channel not found");
  }
  // console.log("SUBSCRIBED CHANNELS", subscribedChannels);

  return res
    .status(200)
    .json(new ApiResponse(200, subscribedChannels, "Channels fetched"));
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
