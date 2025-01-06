const express = require("express");
const {
    chatbotController,
} = require("../controllers/geminiController");
const authenticateToken = require('../utils/auth');

const router = express.Router();

//route
router.post("/chatbot", authenticateToken, chatbotController);

module.exports = router;