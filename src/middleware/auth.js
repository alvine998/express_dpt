const apiKey = "auto_api_rlE14dyBWNbos4UtWhcYGYRa"; // Hardcoded as per request, can be moved to env

const authMiddleware = (req, res, next) => {
  const requestApiKey = req.headers["x-api-key"];

  if (!requestApiKey || requestApiKey !== apiKey) {
    return res.status(401).json({
      message: "Unauthorized: Invalid or missing API Key",
    });
  }

  // Pass headers to request object for easy access in controllers if needed
  req.userSession = req.headers["x-session-token"];
  req.deviceFingerprint = req.headers["x-device-fingerprint"];
  req.adminSession = req.headers["x-admin-session"];
  req.databaseTarget = req.headers["x-database"]; // expected to be aajet-lasik

  next();
};

module.exports = authMiddleware;
