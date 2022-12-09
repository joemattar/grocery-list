var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", {
    webpage_title: "Grocery List",
    title: "Grocery List App",
  });
});

module.exports = router;
