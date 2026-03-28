import express from "express";
import { sendRequest, getMyRequests, updateRequestStatus } from "../controllers/mentorshipController.js";
import authMiddleware from "../middleware/auth.js";

const mentorshipRouter = express.Router();

mentorshipRouter.post("/send", authMiddleware, sendRequest);
mentorshipRouter.get("/my-requests", authMiddleware, getMyRequests);
mentorshipRouter.post("/update-status", authMiddleware, updateRequestStatus);

export default mentorshipRouter;
