import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    //Get the token from client
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    // Header looks like Authorization: Bearer  <token>

    // console.log("TOKEN", token);
    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    // Validate Token
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Find the user in DB
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    //Adding user object to the request
    req.user = user;

    // Middleware
    next();
  } catch (error) {
    throw new ApiError(401, error?.message, "Invalid Access Token");
  }
});
