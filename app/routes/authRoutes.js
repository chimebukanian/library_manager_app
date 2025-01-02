const express = require("express");
const {
  registerController,
  loginController,
  logoutController,
  tokenController
} = require("../controllers/authController");

//router object
const router = express.Router();

//routes
// REGISTER
router.post("/register", registerController);

//LOGIN
router.post("/login", loginController);


//LOGOUT
router.post("/logout", logoutController);

router.post('/token', tokenController);
module.exports = router;