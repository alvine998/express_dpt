const express = require("express");
const router = express.Router();
const usageController = require("../controllers/usageController");
const authMiddleware = require("../middleware/auth");

router.use(authMiddleware);

/**
 * @swagger
 * /api/usage:
 *   post:
 *     summary: Increment Usage Counter
 *     tags: [Usage]
 *     parameters:
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 *           enum: [increment, reset]
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               uid:
 *                 type: string
 *               type:
 *                 type: string
 *               count:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Usage updated
 *   get:
 *     summary: Get Remaining Usage
 *     tags: [Usage]
 *     parameters:
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 *           enum: [remaining]
 *         required: true
 *       - in: query
 *         name: uid
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Usage information
 */
router.post("/", (req, res) => {
  const { action } = req.query;

  if (action === "increment") {
    return usageController.incrementUsage(req, res);
  } else if (action === "reset") {
    return usageController.resetUsage(req, res);
  }

  res
    .status(400)
    .json({ message: "Invalid action. Use action=increment or action=reset" });
});

router.get("/", (req, res) => {
  const { action } = req.query;

  if (action === "remaining") {
    return usageController.getRemainingUsage(req, res);
  }

  res.status(400).json({ message: "Invalid action. Use action=remaining" });
});

module.exports = router;
