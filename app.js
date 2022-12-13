const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const nocache = require("nocache");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
// Initialize database connection from database controller
require("./controllers/database");
// Passport - pass the passport variable into the passport.js controller to be used in the middleware
require("./controllers/passport")(passport);

require("dotenv").config();

const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");
const dashboardRouter = require("./routes/dashboard");

const app = express();

// No cache clear the cache on each http request - solves the back space button issue
app.use(nocache());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Logging ~ morgan
app.use(logger("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Static folder ~ contains all puplic assets
app.use(express.static(path.join(__dirname, "public")));

// Routing
app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/dashboard", dashboardRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
