const express = require("express");
const {
  summaryController,
  paragraphController,
  chatbotController,
  jsconverterController,
  scifiImageController,
} = require("../controllers/openAiController");
const authenticateToken = require('../utils/auth');

const router = express.Router();

//route
router.post("/summary", authenticateToken, summaryController);
router.post("/paragraph", authenticateToken, paragraphController);
router.post("/chatbot", authenticateToken, chatbotController);
router.post("/js-converter", authenticateToken, jsconverterController);
router.post("/scifi-image", authenticateToken, scifiImageController);

module.exports = router;