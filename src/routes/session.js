const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");

router.use(authMiddleware);

/**
 * @swagger
 * /api/session_verify:
 *   get:
 *     summary: Verify Session
 *     tags: [Session]
 *     parameters:
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 *           enum: [verify]
 *         required: true
 *         description: Action to perform
 *     responses:
 *       200:
 *         description: Session verification result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 valid:
 *                   type: boolean
 *                 message:
 *                   type: string
 */
router.get("/", (req, res) => {
  const { action } = req.query;

  if (action === "verify") {
    // Since the request passed authMiddleware, the API key is valid
    // Additional session token verification could be added here
    return res.json({
      valid: true,
      message: "Session is valid",
      timestamp: Date.now(),
    });
  }

  res.status(400).json({ message: "Invalid action" });
});

module.exports = router;
