import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    alumniId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true }, // E.g., "14:30"
    topic: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ["pending", "approved", "rejected", "completed"], default: "pending" },
    meetingLink: { type: String, default: "" }, // Will optionally be populated by alumni later
    // Resume attachment (base64 or URL, uploaded by student when booking)
    resumeUrl: { type: String, default: "" },
    resumeName: { type: String, default: "" },
    // Passport-size photo attachment
    passportPhotoUrl: { type: String, default: "" },
    passportPhotoName: { type: String, default: "" },
}, { timestamps: true });

const appointmentModel = mongoose.models.appointment || mongoose.model("appointment", appointmentSchema);

export default appointmentModel;
