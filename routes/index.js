const express = require("express");
const router = express.Router();

// Home Page
// Route GET /
router.get("/", function (req, res, next) {
  res.render("index", {
    title: "Grocery List App",
    user: req.user,
  });
});

module.exports = router;
