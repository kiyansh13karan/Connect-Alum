import mongoose from "mongoose";

const forumPostSchema = new mongoose.Schema({
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, enum: ["General", "Career Advice", "Interview Prep", "Tech Trends", "Referrals"], default: "General" },
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    comments: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        text: { type: String, required: true },
        date: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

const forumPostModel = mongoose.models.forumPost || mongoose.model("forumPost", forumPostSchema);

export default forumPostModel;
