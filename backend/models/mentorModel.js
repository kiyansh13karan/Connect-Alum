import mongoose from "mongoose"; 

const mentorSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  profileLink: { type: String },
  communication: [{ type: String }],
  organization: { type: String },
  location: { type: String },
  experience: { type: Number },
  expertise: { type: String },
  linkedin: { type: String },
  instagram: { type: String },
  twitter: { type: String },
}, { timestamps: true });

const Mentor = mongoose.model("Mentor", mentorSchema);
export default Mentor;