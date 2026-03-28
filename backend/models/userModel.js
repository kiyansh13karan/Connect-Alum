import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["alumni", "admin", "student"], required: true },
    gradYear: { type: Number },
    company: { type: String },
    currentRole: { type: String },
    location: { type: String },
    experience: { type: String },
    skills: { type: [String], default: [] },
    linkedin: { type: String },
    github: { type: String },
    photo: { type: String },
    bio: { type: String },
    isVerified: { type: Boolean, default: false },
}, { minimize: false, timestamps: true });

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;
