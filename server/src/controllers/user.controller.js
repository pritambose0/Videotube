import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Like } from "../models/like.model.js";

const generateAccessToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    return accessToken;
  } catch (error) {
    throw new ApiError(500, "Error while generating new Access Token");
  }
};

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating Tokens");
  }
};

const setCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 15 * 60 * 1000,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

const registerUser = asyncHandler(async (req, res) => {
  // Get User data from frontend

  const { fullName, email, username, password } = req.body;
  // console.log("req.body - ", req.body);
  // console.log("req.files - ", req.files);

  // Validation (Empty or not)

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // Check user exits or not: username, email

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  // console.log(existedUser);

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  // Check for images, Avatar

  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;
  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }

  // Upload them to Cloudinary, Avatar

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  // console.log("AVATAR:", avatar);
  if (!avatar) {
    throw new ApiError(400, "Cloudinary: Avatar is required");
  }
  // console.log("COVERIMAGE: ", coverImage);
  // Create User Object - Create entry in DB

  const user = await User.create({
    fullName,
    avatar: {
      url: avatar.url,
      publicId: avatar.public_id,
    },
    coverImage:
      {
        url: coverImage.secure_url,
        publicId: coverImage.public_id,
      } || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  // Check whether user is created or not
  // Remove Password and Refresh Token field from response

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  // Return response

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  // Get Data from client

  const { username, email, password } = req.body;
  // console.log("REQ.BODY", req.body);
  // console.log("USERNAME: ", username, "PASSWORD: ", password);
  // Check data whether it is empty or not

  if (!username && !email) {
    throw new ApiError(400, "Username or Email is required");
  }

  // User is registered or not

  const user = await User.findOne({
    $and: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  // Check Password
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Password is incorrect");
  }

  // Give Access Token & Refresh Token

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // Send Cookie
  setCookies(res, accessToken, refreshToken);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser },
        "User Logged in Successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { refreshToken: undefined },
    },
    { new: true } // This will return the new updated document from DB
  );

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body?.refreshToken;
  // console.log("COOKIE", req.cookies);

  if (!incomingRefreshToken) throw new ApiError(401, "Unauthorized request");

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) throw new ApiError(401, "Invalid refresh token");

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired");
    }

    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    const accessToken = await generateAccessToken(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken },
          "Access Token refreshed successfully"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message, "Invalid Refresh Token");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  // console.log("REQ.BODY", req.body);
  // console.log("OLD PASS", oldPassword);
  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordCorrect) throw new ApiError(400, "Invalid old password");
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  // console.log("USER: ", req.user);
  if (!req.user) {
    throw new ApiError(401, "Unauthorized request");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User fetched successfully"));
});

const updateUserDetails = asyncHandler(async (req, res) => {
  const { fullName, email, username } = req.body;
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  const user = await User.findById(req.user?._id);
  if (!user) throw new ApiError(404, "User does not exist");

  // Create update object dynamically based on provided fields
  const updateFields = {};
  if (fullName) updateFields.fullName = fullName;
  if (email) updateFields.email = email;
  if (username) updateFields.username = username;

  // Update user details if there are fields to update
  if (Object.keys(updateFields).length > 0) {
    await User.findByIdAndUpdate(
      req.user?._id,
      { $set: updateFields },
      { new: true }
    ).select("-password -refreshToken");
  }

  // Update avatar if a file is uploaded
  let updatedAvatar;
  if (avatarLocalPath) {
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    if (!avatar?.url)
      throw new ApiError(400, "Error while uploading avatar to Cloudinary");

    const oldAvatarPublicId = user.avatar?.publicId;

    updatedAvatar = await User.findByIdAndUpdate(
      req.user?._id,
      {
        $set: {
          avatar: {
            url: avatar.url,
            publicId: avatar.public_id,
          },
        },
      },
      { new: true }
    ).select("-password -refreshToken");

    if (!updatedAvatar) throw new ApiError(400, "Error while updating avatar");

    // Delete old avatar from Cloudinary
    if (oldAvatarPublicId) {
      const deleteImage = await deleteFromCloudinary(oldAvatarPublicId);
      if (!deleteImage)
        throw new ApiError(
          400,
          "Error while deleting old avatar from Cloudinary"
        );
    }
  }

  // Update cover image if a file is uploaded
  let updatedCoverImage;
  if (coverImageLocalPath) {
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    if (!coverImage?.url)
      throw new ApiError(
        400,
        "Error while uploading cover image to Cloudinary"
      );

    const oldCoverImagePublicId = user.coverImage?.publicId;

    updatedCoverImage = await User.findByIdAndUpdate(
      req.user?._id,
      {
        $set: {
          coverImage: {
            url: coverImage.url,
            publicId: coverImage.public_id,
          },
        },
      },
      { new: true }
    ).select("-password -refreshToken");

    if (!updatedCoverImage)
      throw new ApiError(400, "Error while updating cover image");

    // Delete old cover image from Cloudinary
    if (oldCoverImagePublicId) {
      const deleteImage = await deleteFromCloudinary(oldCoverImagePublicId);
      if (!deleteImage)
        throw new ApiError(
          400,
          "Error while deleting old cover image from Cloudinary"
        );
    }
  }

  // Get the updated user to send in the response
  const updatedUser = await User.findById(req.user?._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedUser, "User details updated successfully")
    );
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;
  if (!username?.trim()) throw new ApiError(404, "Username not found");

  const channel = await User.aggregate([
    {
      $match: {
        username: username?.toLowerCase(),
      },
    },
    // Subscriber: from Subscription model
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    // Channels Subscribed to - Channel: from Subscription model
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    {
      $addFields: {
        subscribersCount: {
          $size: "$subscribers",
        },
        subscribedToCount: {
          $size: "$subscribedTo",
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
        avatar: 1,
        coverImage: 1,
        email: 1,
        subscribersCount: 1,
        subscribedToCount: 1,
        isSubscribed: 1,
      },
    },
  ]);

  // console.log("CHANNEL", channel);
  if (!channel?.length) throw new ApiError(404, "Channel does not exist");

  return res
    .status(200)
    .json(
      new ApiResponse(200, channel[0], "User channel fetched successfully")
    );
});

const getWatchHistory = asyncHandler(async (req, res) => {
  const watchHistory = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user?._id),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchedVideos",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
            },
          },
          {
            $unwind: "$owner",
          },
          {
            $project: {
              _id: 1,
              title: 1,
              thumbnail: 1,
              duration: 1,
              views: 1,
              createdAt: 1,
              owner: {
                _id: 1,
                username: 1,
                "avatar.url": 1,
                fullName: 1,
              },
            },
          },
        ],
      },
    },
    {
      $project: {
        _id: 0,
        watchedVideos: 1,
      },
    },
  ]);

  // console.log("USER", watchHistory);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        watchHistory?.[0]?.watchedVideos,
        "Watch history fetched Successfully"
      )
    );
});

const getUserChannelVideos = asyncHandler(async (req, res) => {
  const { username } = req.params;
  if (!username) {
    throw new ApiError(400, "Username not found");
  }
  // Find the user by username
  const user = await User.findOne({ username });
  // console.log("USER", user);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const videos = await Video.find({ owner: user._id }).populate(
    "owner",
    "fullName avatar"
  );

  // console.log("VIDEOS: ", videos);

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Videos fetched successfully"));
});

const getDashboardData = asyncHandler(async (req, res) => {
  const { username } = req.params;
  if (!username) {
    throw new ApiError(400, "Username not found");
  }

  const user = await User.findOne({ username });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user._id.toString() !== req.user?._id.toString()) {
    throw new ApiError(401, "You are not an admin");
  }

  const totalViews = await Video.aggregate([
    {
      $match: {
        owner: user._id,
      },
    },
    {
      $group: {
        _id: null,
        totalViews: { $sum: "$views" },
      },
    },
  ]);

  const totalLikes = await Like.aggregate([
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "videoDetails",
      },
    },
    {
      $unwind: "$videoDetails",
    },
    {
      $match: {
        "videoDetails.owner": user._id,
      },
    },
    {
      $group: {
        _id: null,
        totalLikes: { $sum: 1 },
      },
    },
  ]);

  const totalVideos = await Video.find({ owner: user._id }).select(
    "-password -refreshToken"
  );

  const subscribers = await User.aggregate([
    {
      $match: {
        subscriber: user._id,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "channel",
        foreignField: "_id",
        as: "subscribers",
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
      },
    },
  ]);
  // console.log("SUBSCRIBERS", subscribers);

  // console.log("TOTAL VIDEOS", videos.length);
  // console.log("TOTAL VIEWS", totalViews);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalViews: totalViews[0]?.totalViews || 0,
        totalSubscribers: subscribers[0]?.subscribersCount || 0,
        totalVideos: totalVideos || 0,
        totalLikes: totalLikes[0]?.totalLikes || 0,
      },
      "Dashboard data fetched successfully"
    )
  );
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateUserDetails,
  getUserChannelProfile,
  getWatchHistory,
  getUserChannelVideos,
  getDashboardData,
};
