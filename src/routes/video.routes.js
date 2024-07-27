import { upload } from "../middlewares/multer.middleware.js";
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getAllVideos,
  getVideoById,
  publishVideo,
} from "../controllers/video.controller.js";

const router = Router();
router.use(verifyJWT); // It applies every route in this file

router.route("/").get(getAllVideos);

router.route("/upload-video").post(
  upload.fields([
    {
      name: "videoFile",
      maxCount: 1,
    },
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  publishVideo
);

router.route("/:videoId").get(getVideoById);

export default router;
