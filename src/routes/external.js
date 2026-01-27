const express = require("express");
const router = express.Router();
const externalController = require("../controllers/externalController");
// Auth for external? Spec says headers 'Origin' etc.
// Assuming checking API Key is not strictly required for these mock endpoints
// OR it might be required if it's part of OUR api.
// I'll verify API key as per "Common headers used in requests".

const authMiddleware = require("../middleware/auth");
router.use(authMiddleware);

/**
 * @swagger
 * /api/servicesjmo/get-public-key:
 *   post:
 *     summary: Get Public Key
 *     tags: [External]
 *     responses:
 *       200:
 *         description: Public key info
 *
 * /api/servicesjmo/tk/getTkByKPJ:
 *   post:
 *     summary: Get TK Data by KPJ (Encrypted)
 *     tags: [External]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               chId:
 *                 type: string
 *               reqId:
 *                 type: string
 *               kodeSegmen:
 *                 type: string
 *               kpj:
 *                 type: string
 *     responses:
 *       200:
 *         description: Decrypted data
 */
router.post("/get-public-key", externalController.getPublicKey);
router.post("/tk/getTkByKPJ", externalController.getTkByKPJ);

module.exports = router;
