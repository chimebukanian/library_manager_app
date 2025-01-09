var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require("cors");
const bodyParser = require("body-parser");
const colors = require("colors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const errorHandler = require("./middlewares/errorMiddleware");
const mongoose = require("mongoose");
const morgan = require("morgan");
//routes path
const authRoutes = require("./routes/authRoutes");

//dotenv
dotenv.config();

//mongo connection
connectDB();

var app = express();

const corsOptions = {
  origin:
    process.env.MODE === "development"
      ? "http://localhost:5173" // Development frontend origin
      : "https://chat-ebukai.onrender.com", // Production frontend origin
  credentials: true, // Allow credentials (cookies)
};

app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(errorHandler);

//API routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/gemini", require("./routes/geminiRoutes")); 

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  const message = res.locals.message = err.message;
  const error = res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ message, error });
});

module.exports = app;
