import User from "../models/User.js";

export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "Email already exists" });
    const user = await User.create({ firstName, lastName, email, password });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const token = user._id.toString();
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getFriends = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.userId } }).select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.userId, req.body, { new: true }).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateProfilePicture = async (req, res) => {
  try {
    const userId = req.userId;
    if (!req.file?.filename) {
      return res.status(400).json({ error: "Profile picture is required" });
    }
    const profilePicture = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(userId, { profilePicture }, { new: true });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
