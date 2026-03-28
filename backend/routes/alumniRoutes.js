import express from "express";
import authMiddleware from "../middleware/auth.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

// Apply auth and role verification to all routes in this file
router.use(authMiddleware);
router.use(roleMiddleware(['alumni']));

// Example Alumni specific endpoints
router.get("/dashboard-data", (req, res) => {
    res.json({ success: true, message: "Welcome to the Alumni Dashboard API" });
});

// A placeholder endpoint for posting jobs
router.post("/post-opportunity", (req, res) => {
    const { title, company, description } = req.body;
    // In a full implementation, save to DB here.
    res.json({ success: true, message: "Opportunity posted successfully" });
});

// A placeholder endpoint for scheduling events
router.post("/schedule-event", (req, res) => {
    const { name, date, link } = req.body;
    // In a full implementation, save to DB here.
    res.json({ success: true, message: "Event scheduled successfully" });
});

export default router;
