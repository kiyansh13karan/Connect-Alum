import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  department: { type: String, required: true },
  location: { type: String, required: true },
  updatedOn: { type: String, required: true },
  tags: { type: [String], required: true },
  price: { type: Number, required: true },
  registrationDaysLeft: { type: Number, required: true },
  description: { type: String, required: true },
  speakers: { type: [String], required: true },
  meetingLink: { type: String, default: "" },
});

const Event = mongoose.model("Event", eventSchema);

export default Event; // ES Module export