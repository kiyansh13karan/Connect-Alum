import userModel from "../models/userModel.js";

const getAlumni = async (req, res) => {
    try {
        const { company, role, skills, gradYear, location, search } = req.query;
        let query = { role: "alumni" };

        if (company) query.company = { $regex: company, $options: "i" };
        if (role) query.currentRole = { $regex: role, $options: "i" };
        if (gradYear) query.gradYear = Number(gradYear);
        if (location) query.location = { $regex: location, $options: "i" };
        if (skills) query.skills = { $in: skills.split(",") };

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { company: { $regex: search, $options: "i" } },
                { currentRole: { $regex: search, $options: "i" } },
                { skills: { $regex: search, $options: "i" } }
            ];
        }

        const alumni = await userModel.find(query).select("-password");
        res.json({ success: true, alumni });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getAlumniById = async (req, res) => {
    try {
        const alumnus = await userModel.findById(req.params.id).select("-password");
        if (!alumnus) return res.status(404).json({ success: false, message: "Alumnus not found" });
        res.json({ success: true, alumnus });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export { getAlumni, getAlumniById };
