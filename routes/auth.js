const express = require("express");
const router = express.Router();
const passport = require("passport");

// Login / Landing Page / Authenticate with Google
// Route GET /auth/google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
    // The below triggers the Google Sign In Accounts selexction on Sign In
    prompt: "select_account",
  })
);

// Google auth callback
// Route GET /auth/google/callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    // CHANGE ACCORDING TO APP NEEDS ~ DASHBOARD ???
    successRedirect: "/dashboard",
    // CHANGE ACCORDING TO APP NEEDS
    failureRedirect: "/",
  })
);

// Google logout user
// Route GET /auth/logout
router.get("/logout", function (req, res, next) {
  req.session.destroy(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

module.exports = router;
