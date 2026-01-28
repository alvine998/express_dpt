const Usage = require("../models/usage");

// POST /api/usage?action=increment
exports.incrementUsage = async (req, res) => {
  try {
    const { uid, type, count = 1 } = req.body;

    if (!uid || !type) {
      return res.status(400).json({ message: "uid and type are required" });
    }

    let usage = await Usage.findOne({ where: { uid, type } });

    if (!usage) {
      // Create new usage record
      usage = await Usage.create({
        uid,
        type,
        count: parseInt(count),
        max_limit: 100,
      });
    } else {
      // Increment count
      usage.count = usage.count + parseInt(count);
      await usage.save();
    }

    const remaining = Math.max(0, usage.max_limit - usage.count);

    res.json({
      success: true,
      remaining,
      used: usage.count,
      limit: usage.max_limit,
    });
  } catch (error) {
    console.error("Increment usage error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// GET /api/usage?action=remaining
exports.getRemainingUsage = async (req, res) => {
  try {
    const { uid, type } = req.query;

    if (!uid || !type) {
      return res.status(400).json({ message: "uid and type are required" });
    }

    let usage = await Usage.findOne({ where: { uid, type } });

    if (!usage) {
      // No usage record means full limit available
      return res.json({
        remaining: 100,
        used: 0,
        limit: 100,
      });
    }

    const remaining = Math.max(0, usage.max_limit - usage.count);

    res.json({
      remaining,
      used: usage.count,
      limit: usage.max_limit,
    });
  } catch (error) {
    console.error("Get remaining usage error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Reset usage (optional utility)
exports.resetUsage = async (req, res) => {
  try {
    const { uid, type } = req.body;

    if (!uid || !type) {
      return res.status(400).json({ message: "uid and type are required" });
    }

    const usage = await Usage.findOne({ where: { uid, type } });

    if (usage) {
      usage.count = 0;
      usage.reset_date = new Date();
      await usage.save();
    }

    res.json({
      success: true,
      remaining: 100,
      used: 0,
      limit: 100,
    });
  } catch (error) {
    console.error("Reset usage error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
