const userModel = require("../models/userModel");
const errorResponse = require("../utils/errorResponse");

// JWT TOKEN
const sendToken = (user, statusCode, res, message) => {
  const accessToken = user.getSignedToken(res);
  res.status(statusCode).json({
    message,
    success: true,
    accessToken,
  });
};

//REGISTER
exports.registerController = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
      //exisitng user
    const exisitingEmail = await userModel.findOne({ email });
    if (exisitingEmail) {
      return next(new errorResponse("Email is already registered", res, false, 500));
        
     
    }
    const user = await userModel.create({ username, email, password });
    // sendToken(user, 201, res, "User signed in successfully");
    console.log("done")
    return res
    .status(201)
    .json({ message: "User signed up successfully", success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'failed, Server error' });
    
  }
};

//LOGIN
exports.loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      return next(new errorResponse("Please provide email or password", res, false, 401));
      //  res.json({message:'Incorrect password or email' });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return next(new errorResponse("Invalid Creditial", res, false, 401));
      // return res.json({message:'Incorrect password or email' }) 
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return next(new errorResponse("Invalid password", res, false, 401));
      // return res.json({message:'Incorrect password or email' }) ;
    }
    //res
    sendToken(user, 200, res, "User logged in successfully");

  } catch (error) {
    console.error(error);
    return next(new errorResponse(error, res, false, 401));
  }
};

exports.tokenController = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.sendStatus(401);
  }
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN);
    const user = await userModel.findById(decoded.id);
    if (!user) {
      console.log('failed')
      return res.sendStatus(403); // Forbidden
    }
    const newAccessToken = jwt.sign({ id: user._id }, process.env.JWT_ACCESS_SECRET, {
      expiresIn: process.env.JWT_ACCESS_EXPIREIN
    });
    
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    return res.sendStatus(403); // Forbidden
  }
};
//LOGOUT
exports.logoutController = async (req, res) => {
  res.clearCookie("refreshToken");
  return res.status(200).json({
    success: true,
    message: "Logout Succesfully",
  });
};
