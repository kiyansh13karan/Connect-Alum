import userModel from "../models/userModel.js";
import mentorshipRequestModel from "../models/MentorshipRequest.js";
import messageModel from "../models/Message.js";
import appointmentModel from "../models/Appointment.js";
import { sendAppointmentEmail } from "../utils/email.js";

// Helper: Verify if a mentor connection is officially accepted
const isConnected = async (studentId, alumniId) => {
    const connection = await mentorshipRequestModel.findOne({
        studentId,
        alumniId,
        status: "accepted" // Connection must be approved
    });
    return !!connection;
};

// 1. Fetch all Alumni to browse
export const browseMentors = async (req, res) => {
    try {
        const mentors = await userModel.find({ role: "alumni" }).select("-password");
        
        // Also fetch the current user's connections so the UI knows who they are connected to
        const connections = await mentorshipRequestModel.find({ studentId: req.userId });
        
        res.json({ success: true, mentors, connections });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Send Message to Connected Mentor
export const sendMessage = async (req, res) => {
    try {
        const { receiverId, content } = req.body;
        const senderId = req.userId;

        // Security: Ensure they are actually connected
        const connected = await isConnected(senderId, receiverId);
        if (!connected) {
            return res.status(403).json({ success: false, message: "You can only message mentors who have accepted your connection request." });
        }

        const newMessage = new messageModel({ sender: senderId, receiver: receiverId, content });
        await newMessage.save();

        res.json({ success: true, message: "Message sent successfully", data: newMessage });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. Fetch Messages with a specific mentor
export const getMessages = async (req, res) => {
    try {
        const { alumniId } = req.params;
        const studentId = req.userId;

        const messages = await messageModel.find({
            $or: [
                { sender: studentId, receiver: alumniId },
                { sender: alumniId, receiver: studentId }
            ]
        }).sort({ timestamp: 1 });

        res.json({ success: true, messages });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 4. Book an Appointment
export const bookAppointment = async (req, res) => {
    try {
        const { alumniId, date, time, topic, description } = req.body;
        const studentId = req.userId;

        // Security: Ensure they are connected
        const connected = await isConnected(studentId, alumniId);
        if (!connected) {
            return res.status(403).json({ success: false, message: "Appointments can only be booked with connected mentors." });
        }

        const newAppointment = new appointmentModel({
            studentId,
            alumniId,
            date,
            time,
            topic,
            description
        });
        await newAppointment.save();

        // Email Notification Logic
        const mentor = await userModel.findById(alumniId);
        if (mentor && mentor.email) {
            await sendAppointmentEmail(mentor.email, mentor.name, req.user.name, date, time, topic, description);
        }

        res.json({ success: true, message: "Appointment booked successfully. The mentor has been notified." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 5. Get Student's Appointments
export const getStudentAppointments = async (req, res) => {
    try {
        const appointments = await appointmentModel.find({ studentId: req.userId }).populate("alumniId", "name company email");
        res.json({ success: true, appointments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
