import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const SERP_API_URL = "https://serpapi.com/search";
const SERP_API_KEY = process.env.SERP_API_KEY;

// Route to fetch jobs
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

export default router;
