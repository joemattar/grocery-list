const express = require("express");
const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", {
    webpage_title: "Grocery List",
    title: "GROCERY LIST",
    user: req.user,
  });
});

module.exports = router;
