import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const healthcheck = asyncHandler(async (req, res) => {
  return resstatus(200).json(new ApiResponse(true, null, "Health check OK"));
});

export { healthcheck };