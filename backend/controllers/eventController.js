import Event from "../models/eventModel.js";

// Get all events — newest first, populate poster info
const getEvents = async (req, res) => {
    try {
        const events = await Event.find()
            .sort({ createdAt: -1 })
            .populate("postedBy", "name company currentRole photo");
        res.status(200).json({ success: true, events });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Get a single event by ID
const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate("postedBy", "name company currentRole photo");
        if (!event) {
            return res.status(404).json({ success: false, message: "Event not found" });
        }
        res.status(200).json({ success: true, event });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

export { getEvents, getEventById };