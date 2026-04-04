import mongoose from "mongoose";

const jobPostSchema = new mongoose.Schema(
    {
        title:       { type: String, required: true },
        company:     { type: String, required: true },
        role:        { type: String, default: "" },
        description: { type: String, default: "" },
        location:    { type: String, default: "Remote" },
        applyLink:   { type: String, default: "" },
        type:        { type: String, enum: ["Job", "Internship", "Referral"], default: "Job" },
        postedBy:    { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
        posterName:  { type: String, default: "" },
    },
    { timestamps: true }
);

const JobPost = mongoose.models.JobPost || mongoose.model("JobPost", jobPostSchema);
export default JobPost;
