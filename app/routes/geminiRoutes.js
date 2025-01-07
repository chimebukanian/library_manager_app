const express = require("express");
const {
    chatbotController,
} = require("../controllers/geminiController");
const authenticateToken = require('../utils/auth');

const router = express.Router();
// authenticateToken,
//route
router.post("/chatbot",  chatbotController);

module.exports = router;