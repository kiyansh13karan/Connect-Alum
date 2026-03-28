import notificationModel from "../models/Notification.js";

const getNotifications = async (req, res) => {
    try {
        const userId = req.userId;
        const notifications = await notificationModel.find({ userId }).sort({ createdAt: -1 }).limit(20);
        res.json({ success: true, notifications });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const markAsRead = async (req, res) => {
    try {
        const { notificationId } = req.body;
        await notificationModel.findByIdAndUpdate(notificationId, { isRead: true });
        res.json({ success: true, message: "Marked as read" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const createNotification = async (userId, type, message, link) => {
    try {
        const newNotif = new notificationModel({ userId, type, message, link });
        await newNotif.save();
    } catch (error) {
        console.error("Error creating notification:", error);
    }
};

export { getNotifications, markAsRead, createNotification };
