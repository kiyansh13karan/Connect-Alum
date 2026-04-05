import express from "express";
import authMiddleware from "../middleware/auth.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import messageModel from "../models/Message.js";
import mentorshipRequestModel from "../models/MentorshipRequest.js";
import userModel from "../models/userModel.js";
import appointmentModel from "../models/Appointment.js";

const router = express.Router();

// Apply auth and role verification to all routes in this file
router.use(authMiddleware);
router.use(roleMiddleware(["alumni"]));

// ── Existing placeholder endpoints ───────────────────────
router.get("/dashboard-data", (req, res) => {
    res.json({ success: true, message: "Welcome to the Alumni Dashboard API" });
});

router.post("/post-opportunity", (req, res) => {
    const { title, company, description } = req.body;
    res.json({ success: true, message: "Opportunity posted successfully" });
});

router.post("/schedule-event", (req, res) => {
    const { name, date, link } = req.body;
    res.json({ success: true, message: "Event scheduled successfully" });
});

// ── Mentorship Request routes (alumni side) ───────────────

/**
 * GET /api/alumni-role/student-requests
 * Returns all mentorship requests sent to this alumni.
 */
router.get("/student-requests", async (req, res) => {
    try {
        const alumniId = req.userId;
        const requests = await mentorshipRequestModel
            .find({ alumniId })
            .populate("studentId", "name email currentRole company")
            .sort({ createdAt: -1 });
        res.json({ success: true, requests });
    } catch (error) {
        console.error("Error fetching student requests:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

/**
 * PATCH /api/alumni-role/student-requests/:id
 * Alumni accepts or rejects a mentorship request.
 */
router.patch("/student-requests/:id", async (req, res) => {
    try {
        const alumniId = req.userId;
        const { id } = req.params;
        const { status } = req.body; // "accepted" | "rejected"

        if (!["accepted", "rejected"].includes(status)) {
            return res.status(400).json({ success: false, message: "Status must be 'accepted' or 'rejected'." });
        }

        const request = await mentorshipRequestModel.findOne({ _id: id, alumniId });
        if (!request) {
            return res.status(404).json({ success: false, message: "Request not found." });
        }

        request.status = status;
        await request.save();
        res.json({ success: true, message: `Request ${status}.`, request });
    } catch (error) {
        console.error("Error updating student request:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// ── Message routes (alumni side) ─────────────────────────

/**
 * GET /api/alumni/conversations
 * Returns all students this alumni has a message thread with,
 * ordered by most recent message.
 */
router.get("/conversations", async (req, res) => {
    try {
        const alumniId = req.userId;

        // Find all messages where alumni is sender OR receiver
        const messages = await messageModel
            .find({
                $or: [{ sender: alumniId }, { receiver: alumniId }],
            })
            .sort({ timestamp: -1 })
            .populate("sender", "name email company currentRole role")
            .populate("receiver", "name email company currentRole role");

        // Collect unique student IDs + last message
        const seen = new Map();
        for (const msg of messages) {
            const other =
                msg.sender._id.toString() === alumniId
                    ? msg.receiver
                    : msg.sender;
            // Only include students (role === 'student')
            if (other.role !== "student") continue;
            if (!seen.has(other._id.toString())) {
                seen.set(other._id.toString(), {
                    student: other,
                    lastMessage: msg.content,
                    lastTime: msg.timestamp,
                });
            }
        }

        // Also fetch all accepted-connection students who may not have messaged yet
        const accepted = await mentorshipRequestModel
            .find({ alumniId, status: "accepted" })
            .populate("studentId", "name email company currentRole role");

        for (const req_ of accepted) {
            const s = req_.studentId;
            if (s && !seen.has(s._id.toString())) {
                seen.set(s._id.toString(), {
                    student: s,
                    lastMessage: null,
                    lastTime: null,
                });
            }
        }

        const conversations = [...seen.values()].sort(
            (a, b) => (b.lastTime || 0) - (a.lastTime || 0)
        );

        res.json({ success: true, conversations });
    } catch (error) {
        console.error("Error fetching alumni conversations:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

/**
 * GET /api/alumni/messages/:studentId
 * Returns the full message thread between this alumni and the student.
 */
router.get("/messages/:studentId", async (req, res) => {
    try {
        const alumniId = req.userId;
        const { studentId } = req.params;

        const messages = await messageModel
            .find({
                $or: [
                    { sender: alumniId, receiver: studentId },
                    { sender: studentId, receiver: alumniId },
                ],
            })
            .sort({ timestamp: 1 });

        res.json({ success: true, messages });
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

/**
 * POST /api/alumni/message
 * Alumni sends a message to a student.
 */
router.post("/message", async (req, res) => {
    try {
        const { receiverId, content } = req.body;
        const alumniId = req.userId;

        if (!receiverId || !content?.trim()) {
            return res.status(400).json({ success: false, message: "receiverId and content are required." });
        }

        // Security: must have an accepted connection
        const connection = await mentorshipRequestModel.findOne({
            studentId: receiverId,
            alumniId,
            status: "accepted",
        });
        if (!connection) {
            return res.status(403).json({
                success: false,
                message: "You can only message students who have an accepted connection with you.",
            });
        }

        const newMessage = await messageModel.create({
            sender: alumniId,
            receiver: receiverId,
            content: content.trim(),
        });

        res.status(201).json({ success: true, message: "Message sent.", data: newMessage });
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// ── Appointment routes (alumni side) ─────────────────────────

/**
 * GET /api/alumni-role/appointments
 * Returns all appointment requests sent to this alumni.
 */
router.get("/appointments", async (req, res) => {
    try {
        const alumniId = req.userId;
        const appointments = await appointmentModel
            .find({ alumniId })
            .populate("studentId", "name email")
            .sort({ createdAt: -1 });
        res.json({ success: true, appointments });
    } catch (error) {
        console.error("Error fetching alumni appointments:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

/**
 * PATCH /api/alumni-role/appointments/:id
 * Alumni approves or rejects an appointment.
 * On approval, a Jitsi meeting link is auto-generated using the appointment ID.
 */
router.patch("/appointments/:id", async (req, res) => {
    try {
        const alumniId = req.userId;
        const { id } = req.params;
        const { status } = req.body; // "approved" | "rejected"

        if (!["approved", "rejected"].includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status. Must be 'approved' or 'rejected'." });
        }

        const appointment = await appointmentModel.findOne({ _id: id, alumniId });
        if (!appointment) {
            return res.status(404).json({ success: false, message: "Appointment not found or not owned by you." });
        }

        appointment.status = status;

        // Auto-generate a Jitsi Meet room link on approval
        if (status === "approved") {
            appointment.meetingLink = `https://meet.jit.si/connectalum-${appointment._id}`;
        }

        await appointment.save();
        res.json({ success: true, message: `Appointment ${status}.`, appointment });
    } catch (error) {
        console.error("Error updating appointment:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
