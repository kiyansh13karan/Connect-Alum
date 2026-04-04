import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import authMiddleware from "../middleware/auth.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import JobPost from "../models/jobPostModel.js";

dotenv.config();

const router = express.Router();
const SERP_API_URL = "https://serpapi.com/search";
const SERP_API_KEY = process.env.SERP_API_KEY;

// ─── SerpAPI job search (existing) ─────────────────────────────────────────
router.get("/", async (req, res) => {
    const { query, location } = req.query;

    if (!query || !location) {
        return res.status(400).json({ error: "Query and location are required." });
    }

    try {
        const response = await axios.get(SERP_API_URL, {
            params: {
                engine: "google_jobs",
                q: query,
                location: location,
                api_key: SERP_API_KEY,
            },
        });

        const jobs = response.data.jobs_results || [];

        const formattedJobs = jobs.map(job => ({
            title: job.title,
            company: job.company_name,
            location: job.location,
            posted: job.detected_extensions?.posted_at || "N/A",
            link: job.job_id,
        }));

        res.json(formattedJobs);
    } catch (error) {
        console.error("Error fetching jobs:", error);
        res.status(500).json({ error: "Failed to fetch job listings." });
    }
});

// ─── Alumni Job Posts ───────────────────────────────────────────────────────

// GET  /api/jobs/alumni-posts  — public; returns all alumni-posted jobs
router.get("/alumni-posts", async (req, res) => {
    try {
        const posts = await JobPost.find()
            .sort({ createdAt: -1 })
            .populate("postedBy", "name company currentRole photo");
        res.json({ success: true, posts });
    } catch (error) {
        console.error("Error fetching alumni posts:", error);
        res.status(500).json({ success: false, message: "Failed to fetch alumni job posts." });
    }
});

// POST /api/jobs/alumni-post  — alumni creates a job post
router.post(
    "/alumni-post",
    authMiddleware,
    roleMiddleware(["alumni"]),
    async (req, res) => {
        try {
            const { title, company, role, description, location, applyLink, type } = req.body;
            if (!title || !company) {
                return res.status(400).json({ success: false, message: "Title and company are required." });
            }
            const post = await JobPost.create({
                title,
                company,
                role:        role        || "",
                description: description || "",
                location:    location    || "Remote",
                applyLink:   applyLink   || "",
                type:        type        || "Job",
                postedBy:    req.userId,
                posterName:  req.user.name,
            });
            res.status(201).json({ success: true, post });
        } catch (error) {
            console.error("Error creating alumni job post:", error);
            res.status(500).json({ success: false, message: "Failed to create job post." });
        }
    }
);

// DELETE /api/jobs/alumni-post/:id  — alumni removes their own post
router.delete(
    "/alumni-post/:id",
    authMiddleware,
    roleMiddleware(["alumni"]),
    async (req, res) => {
        try {
            const post = await JobPost.findById(req.params.id);
            if (!post) {
                return res.status(404).json({ success: false, message: "Post not found." });
            }
            if (post.postedBy.toString() !== req.userId) {
                return res.status(403).json({ success: false, message: "Not authorised to delete this post." });
            }
            await post.deleteOne();
            res.json({ success: true, message: "Post removed." });
        } catch (error) {
            console.error("Error deleting alumni job post:", error);
            res.status(500).json({ success: false, message: "Failed to delete post." });
        }
    }
);

export default router;
