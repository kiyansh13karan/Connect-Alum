import express from "express";
import { getEvents, getEventById } from "../controllers/eventController.js";
import authMiddleware from "../middleware/auth.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import Event from "../models/eventModel.js";

const router = express.Router();

// ── Public / Student routes ──────────────────────────────────
// GET all events (sorted newest first)
router.get("/", getEvents);

// GET single event by ID
router.get("/:id", getEventById);

// ── Alumni-only routes ───────────────────────────────────────

// POST /api/events/alumni-post — alumni creates an event
router.post(
    "/alumni-post",
    authMiddleware,
    roleMiddleware(["alumni"]),
    async (req, res) => {
        try {
            const { title, type, date, time, desc, registerLink } = req.body;
            if (!title || !date) {
                return res.status(400).json({ success: false, message: "Title and date are required." });
            }
            const event = await Event.create({
                title,
                type:         type         || "webinar",
                date,
                time:         time         || "",
                desc:         desc         || "",
                registerLink: registerLink || "",
                status:       "upcoming",
                attendees:    0,
                postedBy:     req.userId,
                posterName:   req.user.name,
                // legacy fields with sensible defaults
                department:   "Alumni",
                location:     "Online",
                updatedOn:    new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
                description:  desc || "",
                price:        0,
                speakers:     [req.user.name],
                tags:         [type || "webinar"],
                registrationDaysLeft: 7,
            });
            res.status(201).json({ success: true, event });
        } catch (error) {
            console.error("Error creating event:", error);
            res.status(500).json({ success: false, message: "Failed to create event." });
        }
    }
);

// DELETE /api/events/alumni-post/:id — alumni removes their own event
router.delete(
    "/alumni-post/:id",
    authMiddleware,
    roleMiddleware(["alumni"]),
    async (req, res) => {
        try {
            const event = await Event.findById(req.params.id);
            if (!event) {
                return res.status(404).json({ success: false, message: "Event not found." });
            }
            if (event.postedBy?.toString() !== req.userId) {
                return res.status(403).json({ success: false, message: "Not authorised to delete this event." });
            }
            await event.deleteOne();
            res.json({ success: true, message: "Event removed." });
        } catch (error) {
            console.error("Error deleting event:", error);
            res.status(500).json({ success: false, message: "Failed to delete event." });
        }
    }
);

export default router;