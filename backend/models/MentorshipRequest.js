import mongoose from "mongoose";

const mentorshipRequestSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    alumniId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
    date: { type: Date, default: Date.now }
}, { timestamps: true });

const mentorshipRequestModel = mongoose.models.mentorshipRequest || mongoose.model("mentorshipRequest", mentorshipRequestSchema);

export default mentorshipRequestModel;
