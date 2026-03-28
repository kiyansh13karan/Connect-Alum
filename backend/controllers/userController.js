import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

// Helper Function to Create JWT Token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" }); // Expires in 7 days
};

// **🔹 User Login**
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User doesn't exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const token = createToken(user._id);
        res.status(200).json({ success: true, token, role: user.role }); // Include role in response
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// **🔹 User Registration**
const registerUser = async (req, res) => {
    const { name, email, password, role, gradYear, company } = req.body;

    try {
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Invalid email format" });
        }

        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
            role,
            gradYear,
            company
        });
        await newUser.save();

        const token = createToken(newUser._id);
        res.status(201).json({ success: true, token, role: newUser.role });

    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// **🔹 Get User Profile**
const getProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.userId).select("-password");
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// **🔹 Update User Profile**
const updateProfile = async (req, res) => {
    try {
        const { name, bio, skills, linkedin, github, experience, company } = req.body;
        await userModel.findByIdAndUpdate(req.userId, {
            name, bio, skills, linkedin, github, experience, company
        });
        res.json({ success: true, message: "Profile Updated" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export { loginUser, registerUser, getProfile, updateProfile };
