const express = require("express");
const router = express.Router();
const batchController = require("../controllers/batchController");
const authMiddleware = require("../middleware/auth");

router.use(authMiddleware);

/**
 * @swagger
 * /api/batches:
 *   get:
 *     summary: Get Batches
 *     tags: [Batches]
 *     parameters:
 *       - in: query
 *         name: uid
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           description: comma separated statuses (pending,processing)
 *     responses:
 *       200:
 *         description: List of batches
 *   post:
 *     summary: Create or Update Batch
 *     tags: [Batches]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               uid:
 *                 type: string
 *               batch_id:
 *                 type: string
 *               source:
 *                 type: string
 *               kpj_list:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Batch saved
 *   put:
 *     summary: Update Batch Status or Progress
 *     tags: [Batches]
 *     parameters:
 *       - in: query
 *         name: batch_id
 *         schema:
 *           type: string
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 *           enum: [mark_all_done]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *               increment_completed:
 *                 type: boolean
 *               uid:
 *                 type: string
 *               action:
 *                 type: string
 *     responses:
 *       200:
 *         description: Update successful
 */
router.get("/", batchController.getBatches);
router.post("/", batchController.createOrUpdateBatch);

// PUT handles multiple cases based on query params or body
router.put("/", (req, res) => {
  const { batch_id, action } = req.query;

  if (action === "mark_all_done") {
    return batchController.markAllDone(req, res);
  }

  if (batch_id) {
    if (req.body.increment_completed) {
      return batchController.incrementCompleted(req, res);
    }
    if (req.body.status) {
      return batchController.updateBatchStatus(req, res);
    }
    // Fallback or error if neither
    return res.status(400).json({ message: "Invalid update parameters" });
  }

  res.status(400).json({ message: "Missing batch_id or action" });
});

module.exports = router;
