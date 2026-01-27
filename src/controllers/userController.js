const User = require("../models/user");
const { v4: uuidv4 } = require("uuid");

exports.login = async (req, res) => {
  try {
    const { username, password, device_info } = req.body;

    // In a real app, hash checking should happen here.
    // Assuming simple check or direct comparison for now as per "login" action.
    // If user doesn't exist, maybe we should create or return error?
    // The spec implies we return user data. I'll search for user first.

    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Update last login
    user.last_login = Date.now();
    if (device_info) {
      user.device_id = device_info; // Logic might be more complex
    }
    await user.save();

    res.json({
      data: {
        uid: user.uid,
        username: user.username,
        role: user.role,
        suspended: user.suspended,
        device_id: user.device_id,
        last_login: user.last_login,
        expiration_date: user.expiration_date,
        jenis_apps: user.jenis_apps,
        custom_domain: user.custom_domain,
        message: "Login successful",
        min_version: user.min_version,
        current_version: user.current_version,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.logout = async (req, res) => {
  try {
    const { uid, device_info } = req.body;
    // Logic for logout, maybe invalidate session if we had one stored.
    // For now just return success.
    res.json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
