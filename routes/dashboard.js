const express = require("express");
const router = express.Router();
const isAuthorized = require("../controllers/authentication");

/* GET dashboard user grocery lists page. */
router.get("/", isAuthorized, function (req, res, next) {
  res.render("dashboard", {
    webpage_title: "Dashboard - Grocery List",
    title: "GROCERY LIST",
    user: req.user,
  });
});

module.exports = router;
