const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/auth");

router.use(authMiddleware);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: User Login or Logout
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 *           enum: [login, logout]
 *         required: true
 *         description: Action to perform
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               device_info:
 *                 type: string
 *               uid:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 */
router.post("/", (req, res) => {
  const action = req.query.action;
  if (action === "login") {
    return userController.login(req, res);
  } else if (action === "logout") {
    return userController.logout(req, res);
  } else {
    res.status(400).json({ message: "Invalid action" });
  }
});

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Validate User
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: uid
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID to validate
 *       - in: query
 *         name: validate
 *         schema:
 *           type: integer
 *           enum: [1]
 *         required: true
 *         description: Must be 1 for validation
 *     responses:
 *       200:
 *         description: Validation result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 valid:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 */
router.get("/", (req, res) => {
  const validate = req.query.validate;
  if (validate === "1") {
    return userController.validateUser(req, res);
  }
  res.status(400).json({ message: "Invalid request. Use validate=1" });
});

module.exports = router;
