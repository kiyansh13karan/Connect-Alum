import Mentor from "../models/mentorModel.js"; // ✅ Ensure correct import

export const addMentor = async (req, res) => {
  try {
    const newMentor = new Mentor(req.body); // ✅ Create a new mentor instance
    await newMentor.save(); // ✅ Save to MongoDB
    res.status(201).json({ message: "Mentor added successfully!", mentor: newMentor });
  } catch (error) {
    console.error("❌ Error saving mentor:", error);
    res.status(500).json({ error: "Failed to save mentor." });
  }
};
