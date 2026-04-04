import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
    {
        title:       { type: String, required: true },
        type:        { type: String, enum: ["webinar", "career", "ama"], default: "webinar" },
        date:        { type: String, default: "" },          // "YYYY-MM-DD"
        time:        { type: String, default: "" },          // "HH:MM"
        desc:        { type: String, default: "" },
        registerLink:{ type: String, default: "" },
        status:      { type: String, enum: ["upcoming", "completed"], default: "upcoming" },
        attendees:   { type: Number, default: 0 },
        postedBy:    { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
        posterName:  { type: String, default: "" },

        // Legacy fields kept for backwards-compat with the old seeded events
        department:  { type: String, default: "" },
        location:    { type: String, default: "Online" },
        updatedOn:   { type: String, default: "" },
        tags:        { type: [String], default: [] },
        price:       { type: Number, default: 0 },
        registrationDaysLeft: { type: Number, default: 7 },
        description: { type: String, default: "" },
        speakers:    { type: [String], default: [] },
        meetingLink: { type: String, default: "" },
    },
    { timestamps: true }
);

const Event = mongoose.models.Event || mongoose.model("Event", eventSchema);
export default Event;