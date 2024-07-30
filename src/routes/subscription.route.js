import { Router } from "express";
import {
  getSubscribedChannels,
  getUserChannelSubscribers,
  toggleSubscription,
} from "../controllers/subscription.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/c/:channelId");

router.route("/c/subscribers/:channelId").get(getUserChannelSubscribers);
router.route("/c/subscribed-to/:channelId").get(getSubscribedChannels);
router.route("/c/:channelId").post(toggleSubscription);

export default router;
