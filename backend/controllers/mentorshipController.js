import mentorshipRequestModel from "../models/MentorshipRequest.js";
import userModel from "../models/userModel.js";
import { createNotification } from "./notificationController.js";

const sendRequest = async (req, res) => {
    try {
        const { alumniId, message } = req.body;
        const studentId = req.userId;

        const newRequest = new mentorshipRequestModel({ studentId, alumniId, message });
        await newRequest.save();

        const student = await userModel.findById(studentId);
        await createNotification(alumniId, "mentorship", `${student.name} sent you a mentorship request.`, "/mentorship");

        res.json({ success: true, message: "Mentorship request sent successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getMyRequests = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await userModel.findById(userId);

        let requests;
        if (user.role === "alumni") {
            requests = await mentorshipRequestModel.find({ alumniId: userId }).populate("studentId", "name email");
        } else {
            requests = await mentorshipRequestModel.find({ studentId: userId }).populate("alumniId", "name email company currentRole");
        }

        res.json({ success: true, requests });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateRequestStatus = async (req, res) => {
    try {
        const { requestId, status } = req.body;
        const alumniId = req.userId;

        const request = await mentorshipRequestModel.findById(requestId);
        if (!request) return res.status(404).json({ success: false, message: "Request not found" });

        if (request.alumniId.toString() !== alumniId) {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        request.status = status;
        await request.save();

        await createNotification(request.studentId, "mentorship", `Your mentorship request has been ${status}.`, "/mentorship");

        res.json({ success: true, message: `Request ${status}` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export { sendRequest, getMyRequests, updateRequestStatus };
