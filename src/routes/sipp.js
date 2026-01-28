const express = require("express");
const router = express.Router();
const sippController = require("../controllers/sippController");
const authMiddleware = require("../middleware/auth");

router.use(authMiddleware);

/**
 * @swagger
 * /api/sipp_history:
 *   get:
 *     summary: Get SIPP History
 *     tags: [SIPP]
 *     parameters:
 *       - in: query
 *         name: uid
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: kota
 *         schema:
 *           type: string
 *       - in: query
 *         name: exclude_pending
 *         schema:
 *           type: integer
 *       - in: query
 *         name: batch
 *         schema:
 *           type: string
 *       - in: query
 *         name: processing_status
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: SIPP History records
 *   put:
 *     summary: Update Single SIPP Record
 *     tags: [SIPP]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               uid:
 *                 type: string
 *               kpj:
 *                 type: string
 *               processing_status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Record updated
 *   post:
 *     summary: Bulk Update/Insert SIPP Records
 *     tags: [SIPP]
 *     parameters:
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 *           enum: [bulk]
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
 *               records:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Bulk update processed
 */
router.get("/", sippController.getHistory);

router.put("/", sippController.updateRecord);

router.post("/", (req, res) => {
  if (req.query.action === "bulk") {
    return sippController.bulkUpdate(req, res);
  }
  res.status(400).json({ message: "Invalid action" });
});

/**
 * @swagger
 * /api/sipp_history:
 *   delete:
 *     summary: Delete SIPP Record
 *     tags: [SIPP]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Record deleted
 */
router.delete("/", sippController.deleteRecord);

module.exports = router;
