import express from "express";
import { getEvents, getEventById } from "../controllers/eventController.js";

const router = express.Router();

// GET all events
router.get("/", getEvents);

// GET a single event by ID
router.get("/:id", getEventById);

export default router; // ES Module export