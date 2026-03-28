import express from "express";
import authMiddleware from "../middleware/auth.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import { browseMentors, sendMessage, getMessages, bookAppointment, getStudentAppointments } from "../controllers/studentController.js";
import { sendRequest, getMyRequests } from "../controllers/mentorshipController.js";
import { getEvents } from "../controllers/eventController.js";

const router = express.Router();

// Apply auth and role verification to all routes in this file
router.use(authMiddleware);
router.use(roleMiddleware(['student']));

// Existing core data
router.get("/dashboard-data", (req, res) => {
    res.json({ success: true, message: "Welcome to the Student Dashboard API" });
});

// Mentor Discovery & Connectivity
router.get("/mentors", browseMentors);
router.post("/connect-mentor", sendRequest); // Reusing proven mentorship logic
router.get("/connections", getMyRequests);

// Messaging
router.post("/message", sendMessage);
router.get("/messages/:alumniId", getMessages);

// Appointments & Voice Calls
router.post("/book-appointment", bookAppointment);
router.get("/appointments", getStudentAppointments);

// Events
router.get("/events", getEvents);

export default router;
