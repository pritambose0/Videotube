import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    throw new ApiError(400, "createPlaylist :: Name is required");
  }

  const playlist = await Playlist.create({
    name,
    description: description || "",
    owner: req.user?._id,
  });

  if (!playlist) {
    throw new ApiError(400, "createPlaylist :: Error while creating playlist");
  }
  //   console.log("PLAYLIST", playlist);

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist created successfully"));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { username } = req.params;
  if (!username) {
    throw new ApiError(400, "Username is not valid");
  }
  const user = await User.findOne({ username });
  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const playlists = await Playlist.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(user._id),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "videos",
        foreignField: "_id",
        as: "videos",
      },
    },
    {
      $project: {
        name: 1,
        description: 1,
        createdAt: 1,
        owner: 1,
        "videos.thumbnail": 1,
      },
    },
  ]);

  // OR

  // const playlist = await Playlist.find({ owner: userId });

  // console.log("PLAYLISTS", playlists);
  return res
    .status(200)
    .json(new ApiResponse(200, playlists, "Playlists fetched successfully"));
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  if (!playlistId || !isValidObjectId(playlistId)) {
    throw new ApiError(400, "getPlaylistById :: Playlist Id is not valid");
  }

  const playlist = await Playlist.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(playlistId),
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
              subscriberCount: {
                $size: "$subscribers",
              },
            },
          },
          {
            $project: {
              avatar: 1,
              fullName: 1,
              subscriberCount: 1,
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
        from: "videos",
        localField: "videos",
        foreignField: "_id",
        as: "videos",
        pipeline: [
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
                    fullName: 1,
                  },
                },
              ],
            },
          },
          {
            $unwind: "$owner",
          },
          {
            $project: {
              _id: 1,
              title: 1,
              description: 1,
              views: 1,
              duration: 1,
              thumbnail: 1,
              owner: 1,
              createdAt: 1,
            },
          },
        ],
      },
    },
  ]);

  if (!playlist) {
    throw new ApiError(400, "getPlaylistById :: Playlist not found");
  }
  //   console.log("PLAYLIST", playlist);

  return res
    .status(200)
    .json(new ApiResponse(200, playlist[0], "Playlist fetched successfully"));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  if (!playlistId || !isValidObjectId(playlistId)) {
    throw new ApiError(400, "addVideoToPlaylist :: Playlist Id is not valid");
  }

  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiError(400, "addVideoToPlaylist :: Video Id is not valid");
  }

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(400, "addVideoToPlaylist :: Playlist not found");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(400, "addVideoToPlaylist :: Video not found");
  }

  if (playlist.owner._id.toString() !== req.user?._id.toString()) {
    throw new ApiError(
      401,
      "addVideoToPlaylist :: You do not have permission to perform this action"
    );
  }

  if (playlist.videos.includes(videoId)) {
    throw new ApiError(400, "addVideoToPlaylist :: Video already in playlist");
  }

  playlist.videos.push(videoId);
  await playlist.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(
      new ApiResponse(200, playlist, "Video added to playlist successfully")
    );
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  if (!playlistId || !isValidObjectId(playlistId)) {
    throw new ApiError(400, "addVideoToPlaylist :: Playlist Id is not valid");
  }

  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiError(400, "addVideoToPlaylist :: Video Id is not valid");
  }

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(400, "addVideoToPlaylist :: Playlist not found");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(400, "addVideoToPlaylist :: Video not found");
  }

  if (playlist.owner._id.toString() !== req.user?._id.toString()) {
    throw new ApiError(
      401,
      "addVideoToPlaylist :: You do not have permission to perform this action"
    );
  }

  if (!playlist.videos.includes(videoId)) {
    throw new ApiError(400, "addVideoToPlaylist :: Video not in playlist");
  }

  playlist.videos = playlist.videos.filter((vid) => vid.toString() !== videoId);
  await playlist.save({ validateBeforeSave: false });
  // console.log("PLAYLIST", playlist);

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Video removed successfully"));
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  if (!playlistId || !isValidObjectId(playlistId)) {
    throw new ApiError(400, "deletePlaylist :: Playlist id is not valid");
  }

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(400, "deletePlaylist :: Playlist not found");
  }

  if (req.user?._id.toString() !== playlist.owner.toString()) {
    throw new ApiError(
      401,
      "deletePlaylist :: You do not have permission to perform this action"
    );
  }
  const deletePlaylist = await Playlist.findByIdAndDelete(playlistId);
  if (!deletePlaylist) {
    throw new ApiError(500, "deletePlaylist :: Error while deleting playlist");
  }
  console.log("PLAYLIST", deletePlaylist);

  return res
    .status(200)
    .json(
      new ApiResponse(200, deletePlaylist, "Playlist deleted successfully")
    );
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;

  if (!playlistId || !isValidObjectId(playlistId)) {
    throw new ApiError(400, "updatePlaylist :: Playlist id is not valid");
  }

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(400, "updatePlaylist :: Playlist not found");
  }

  if (!name) {
    throw new ApiError(400, "updatePlaylist :: Name is required");
  }

  if (req.user?._id.toString() !== playlist.owner.toString()) {
    throw new ApiError(
      401,
      "updatePlaylist :: You do not have permission to perform this action"
    );
  }

  const updatedPlaylist = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $set: { name, description: description || playlist.description },
    },
    {
      new: true,
    }
  );

  if (!updatePlaylist) {
    throw new ApiError(500, "updatePlaylist :: Error while updating playlist");
  }
  // console.log("PLAYLIST", updatedPlaylist);

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedPlaylist, "Playlist updated successfully")
    );
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
