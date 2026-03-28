import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, message: "Not Authorized, Please Login" });
    }

    try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await userModel.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(401).json({ success: false, message: "User not found or deleted" });
        }

        req.userId = decoded.id;  // Store userId for further use (compatibility)
        req.user = user;          // Store full user for role checks
        next();
    } catch (error) {
        console.error("Auth Middleware Error:", error);
        return res.status(403).json({ success: false, message: "Invalid or Expired Token" });
    }
};

export default authMiddleware;
