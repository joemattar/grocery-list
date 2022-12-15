const List = require("../models/List");
const Item = require("../models/Item");

const async = require("async");
const { body, validationResult } = require("express-validator");

// Dashboard display USER LISTS page on GET
module.exports.user_lists = function (req, res, next) {
  List.find({ users: req.user.id }, "name")
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

// Dashboard create USER LIST page on GET
module.exports.list_create_get = (req, res, next) => {
  // Successful, so render.
  res.render("list_form", {
    title: "Create List - Grocery List App",
    page_title: "Create List",
    user: req.user,
  });
};

// Dashboard create USER LIST page on POST
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
        page_title: "Create List",
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

// Dashboard display USER LIST details page on GET
exports.list_detail = (req, res, next) => {
  async.parallel(
    {
      list(callback) {
        List.findOne({ _id: req.params.id, users: req.user.id })
          .populate("owner")
          .populate("users")
          .exec(callback);
      },
      list_items(callback) {
        Item.find({ list: req.params.id })
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
        title: `${results.list.name} List - Grocery List App`,
        user: req.user,
        list: results.list,
        list_items: results.list_items,
      });
    }
  );
};

// Dashboard edit USER LIST page on GET
exports.list_edit_get = (req, res, next) => {
  List.findOne({ _id: req.params.id, users: req.user.id }).exec(function (
    err,
    list
  ) {
    if (err) {
      return next(err);
    }
    // Successful, so render.
    res.render("list_form", {
      title: "Edit List - Grocery List App",
      page_title: "Edit List",
      user: req.user,
      list,
    });
  });
};

// Dashboard edit USER LIST page on POST
exports.list_edit_post = [
  // Validate and sanitize fields.
  body("name", "List name must be specified").trim().isLength({ min: 1 }),
  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    // Find the list in db
    List.findOne({ _id: req.params.id, users: req.user.id }).exec(function (
      err,
      selected_list
    ) {
      if (err) {
        next(err);
      }
      // Create a List object with trimmed data.
      const list = new List({ ...selected_list, name: req.body.name });

      if (!errors.isEmpty()) {
        // There are errors.
        // Render form again with sanitized values and error messages.
        res.render("list_form", {
          title: "Update List - Grocery List App",
          page_title: "Update List",
          user: req.user,
          list,
          errors: errors.array(),
        });
        return;
      }

      // Data from form is valid.
      List.updateOne(
        { _id: req.params.id, users: req.user.id },
        { name: req.body.name }
      ).exec(function (err) {
        if (err) {
          return next(err);
        }
        // Successful: redirect to new record.
        res.redirect(selected_list.url);
      });
    });
  },
];

// Dashboard delete USER LIST page on GET
exports.list_delete_get = (req, res, next) => {
  async.parallel(
    {
      list(callback) {
        List.findOne({ _id: req.params.id, users: req.user.id })
          .populate("owner")
          .exec(callback);
      },
      items(callback) {
        Item.find({ list: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        next(err);
      }
      res.render("list_delete", {
        title: "Delete List - Grocery List App",
        page_title: "Delete List",
        user: req.user,
        list: results.list,
        list_items: results.items,
      });
    }
  );
};

// Dashboard delete USER LIST page on POST
exports.list_delete_post = (req, res, next) => {
  async.parallel(
    {
      list(callback) {
        List.findOne({ _id: req.params.id, users: req.user.id })
          .populate("owner")
          .exec(callback);
      },
      items(callback) {
        Item.find({ list: req.params.id }).populate("list").exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        next(err);
      }
      Item.deleteMany({ list: req.params.id }).exec(function (err) {
        if (err) {
          next(err);
        }
        List.deleteOne({ _id: req.params.id }).exec(function (err) {
          if (err) {
            next(err);
          }
          // Success - go to back to dashboard
          res.redirect("/dashboard");
        });
      });
    }
  );
};
