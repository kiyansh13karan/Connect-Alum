import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    content: { type: String, default: "" },
    // Document sharing fields
    fileUrl: { type: String, default: "" },       // base64 data URL or file URL
    fileName: { type: String, default: "" },      // original file name
    fileType: { type: String, default: "" },      // MIME type e.g. application/pdf
    timestamp: { type: Date, default: Date.now },
}, { timestamps: true });

const messageModel = mongoose.models.message || mongoose.model("message", messageSchema);

export default messageModel;
