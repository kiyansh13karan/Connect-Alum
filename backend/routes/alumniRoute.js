import express from "express";
import { getAlumni, getAlumniById } from "../controllers/alumniController.js";
import authMiddleware from "../middleware/auth.js";

const alumniRouter = express.Router();

alumniRouter.get("/", authMiddleware, getAlumni);
alumniRouter.get("/:id", authMiddleware, getAlumniById);

export default alumniRouter;
