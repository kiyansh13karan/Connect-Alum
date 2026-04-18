import express from "express";
import authMiddleware from "../middleware/auth.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import messageModel from "../models/Message.js";
import mentorshipRequestModel from "../models/MentorshipRequest.js";
import userModel from "../models/userModel.js";
import appointmentModel from "../models/Appointment.js";
import { createNotification } from "../controllers/notificationController.js";
import jobPostModel from "../models/jobPostModel.js";

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

        if (!["accepted", "rejected", "pending"].includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status." });
        }

        const request = await mentorshipRequestModel.findOne({ _id: id, alumniId });
        if (!request) {
            return res.status(404).json({ success: false, message: "Request not found." });
        }

        request.status = status;
        await request.save();

        // Notify the student of the decision
        const alumni = await userModel.findById(alumniId).select("name");
        const alumniName = alumni?.name || "the alumni";
        if (status === "accepted") {
            await createNotification(
                request.studentId,
                "mentorship",
                `🎉 ${alumniName} accepted your mentorship request! You can now message and book appointments.`,
                "/student/messages"
            );
        } else if (status === "rejected") {
            await createNotification(
                request.studentId,
                "mentorship",
                `${alumniName} has declined your mentorship request.`,
                "/student/mentors"
            );
        }

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
        const { receiverId, content, fileUrl, fileName, fileType } = req.body;
        const alumniId = req.userId;

        // Must have either text content or a file attachment
        if (!receiverId || (!content?.trim() && !fileUrl)) {
            return res.status(400).json({ success: false, message: "receiverId and content or file are required." });
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
            content: content?.trim() || "",
            fileUrl: fileUrl || "",
            fileName: fileName || "",
            fileType: fileType || "",
        });

        res.status(201).json({ success: true, message: "Message sent.", data: newMessage });
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// ── Analytics endpoint (alumni side) ────────────────────────

/**
 * GET /api/alumni-role/analytics
 * Returns real statistics for this alumni's dashboard.
 */
router.get("/analytics", async (req, res) => {
    try {
        const alumniId = req.userId;

        // Parallel DB queries
        const [allRequests, allMessages, allAppointments, jobPosts] = await Promise.all([
            mentorshipRequestModel.find({ alumniId })
                .populate("studentId", "name email")
                .sort({ createdAt: -1 }),
            messageModel.find({ $or: [{ sender: alumniId }, { receiver: alumniId }] })
                .sort({ timestamp: -1 }),
            appointmentModel.find({ alumniId }).sort({ createdAt: -1 }),
            jobPostModel.find({ postedBy: alumniId }).sort({ createdAt: -1 }),
        ]);

        const studentsConnected = allRequests.filter(r => r.status === "accepted").length;
        const pendingRequests = allRequests.filter(r => r.status === "pending").length;
        const messagesCount = allMessages.length;
        const opportunitiesCount = jobPosts.length;
        const appointmentsCount = allAppointments.length;

        // Build recent activity feed (last 10 items across all types)
        const activity = [];

        allRequests.slice(0, 5).forEach(r => {
            const name = r.studentId?.name || "A student";
            if (r.status === "accepted") {
                activity.push({ icon: "✅", text: `${name} connection accepted`, time: r.updatedAt, color: "#10b981" });
            } else if (r.status === "pending") {
                activity.push({ icon: "🆕", text: `New connection request from ${name}`, time: r.createdAt, color: "#6366f1" });
            } else {
                activity.push({ icon: "❌", text: `Request from ${name} declined`, time: r.updatedAt, color: "#ef4444" });
            }
        });

        allMessages.slice(0, 3).forEach(m => {
            const isSender = m.sender.toString() === alumniId;
            activity.push({
                icon: "💬",
                text: isSender ? "You sent a message" : "New message received",
                time: m.timestamp,
                color: "#8b5cf6"
            });
        });

        allAppointments.slice(0, 3).forEach(a => {
            activity.push({
                icon: "📅",
                text: `Appointment ${a.status} – ${a.topic || "Session"}`,
                time: a.createdAt,
                color: "#f59e0b"
            });
        });

        jobPosts.slice(0, 2).forEach(j => {
            activity.push({
                icon: "📢",
                text: `You posted "${j.title}" at ${j.company || ""}`,
                time: j.createdAt,
                color: "#3b82f6"
            });
        });

        // Sort by time desc, take top 8
        activity.sort((a, b) => new Date(b.time) - new Date(a.time));
        const recentActivity = activity.slice(0, 8);

        // Weekly breakdown (last 7 days) for requests
        const weeklyData = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dayStr = d.toLocaleDateString("en-US", { weekday: "short" });
            const startOfDay = new Date(d.setHours(0,0,0,0));
            const endOfDay = new Date(d.setHours(23,59,59,999));
            const dayRequests = allRequests.filter(r => {
                const c = new Date(r.createdAt);
                return c >= startOfDay && c <= endOfDay;
            }).length;
            const dayMessages = allMessages.filter(m => {
                const t = new Date(m.timestamp);
                return t >= startOfDay && t <= endOfDay;
            }).length;
            weeklyData.push({ day: dayStr, requests: dayRequests, messages: dayMessages });
        }

        res.json({
            success: true,
            stats: { studentsConnected, pendingRequests, messagesCount, opportunitiesCount, appointmentsCount },
            recentActivity,
            weeklyData,
        });
    } catch (error) {
        console.error("Error fetching alumni analytics:", error);
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
