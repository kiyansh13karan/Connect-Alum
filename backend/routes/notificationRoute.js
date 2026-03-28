import express from "express";
import { getNotifications, markAsRead } from "../controllers/notificationController.js";
import authMiddleware from "../middleware/auth.js";

const notificationRouter = express.Router();

notificationRouter.get("/", authMiddleware, getNotifications);
notificationRouter.post("/read", authMiddleware, markAsRead);

export default notificationRouter;
