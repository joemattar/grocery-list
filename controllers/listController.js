const List = require("../models/List");
const User = require("../models/User");
const Item = require("../models/Item");

const async = require("async");
const { body, validationResult } = require("express-validator");

// Display list of all lists for the current user.
module.exports.user_lists = function (req, res, next) {
  List.find({}, "name")
    .sort({ name: 1 })
    .populate("owner")
    .populate("users")
    .exec(function (err, user_lists) {
      if (err) {
        return next(err);
      }
      // Successful, so render
      res.render("dashboard", {
        title: `${req.user.firstName}'s Lists - Grocery List App`,
        user: req.user,
        user_lists: user_lists,
      });
    });
};

// Display list create form on GET.
module.exports.list_create_get = (req, res, next) => {
  // Successful, so render.
  res.render("list_form", {
    title: "Create List - Grocery List App",
    user: req.user,
  });
};

// Handle list create on POST.
exports.list_create_post = [
  // Validate and sanitize fields.
  body("name", "List name must be specified").trim().isLength({ min: 1 }),
  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a List object with trimmed data.
    const list = new List({
      name: req.body.name,
      owner: req.user._id,
      users: [req.user._id],
    });

    if (!errors.isEmpty()) {
      // There are errors.
      // Render form again with sanitized values and error messages.
      res.render("list_form", {
        title: "Create List - Grocery List App",
        user: req.user,
        list,
        errors: errors.array(),
      });
      return;
    }

    // Data from form is valid.
    list.save((err) => {
      if (err) {
        return next(err);
      }
      // Successful: redirect to new record.
      res.redirect(list.url);
    });
  },
];

// Display detail page for a specific list.
exports.list_detail = (req, res, next) => {
  async.parallel(
    {
      list(callback) {
        List.findOne({ _id: req.params.id })
          .populate("owner")
          .populate("users")
          .exec(callback);
      },
      list_items(callback) {
        Item.find({ list: req.params.id }, "name")
          .sort({ status: -1 })
          .sort({ name: 1 })
          .exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        // Error in API usage.
        return next(err);
      }
      if (results.list == null) {
        // No results.
        const err = new Error("List not found");
        err.status = 404;
        return next(err);
      }
      // Successful, so render.
      res.render("list_details", {
        title: "Create List - Grocery List App",
        user: req.user,
        list: results.list,
        list_items: results.list_items,
      });
    }
  );
};
