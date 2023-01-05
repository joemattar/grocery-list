const User = require("../models/User");
const List = require("../models/List");
const Item = require("../models/Item");
const Invitation = require("../models/Invitation");
const invitationController = require("../controllers/invitationController");

const async = require("async");
const { body, validationResult } = require("express-validator");

// Dashboard display USER LISTS on GET
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

// Dashboard create USER LIST on GET
module.exports.list_create_get = (req, res, next) => {
  // Successful, so render.
  res.render("list_form", {
    title: "Create List - Grocery List App",
    page_title: "Create List",
    user: req.user,
  });
};

// Dashboard create USER LIST on POST
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

// Dashboard display USER LIST details on GET
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

// Dashboard edit USER LIST on GET
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

// Dashboard edit USER LIST on POST
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

// Dashboard delete USER LIST on GET
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

// Dashboard delete USER LIST on POST
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

// Dashboard display USER LIST SHARE on GET
exports.list_share_get = (req, res, next) => {
  async.parallel(
    {
      list(callback) {
        List.findOne({ _id: req.params.id, users: req.user.id })
          .populate("owner")
          .populate("users")
          .exec(callback);
      },
      invitations(callback) {
        Invitation.find({ list: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        next(err);
      }
      // Success - render the list share form
      res.render("list_share", {
        title: "Share List - Grocery List App",
        page_title: "Share List",
        user: req.user,
        list: results.list,
        invitations: results.invitations,
      });
    }
  );
};

// Dashboard add LIST USER on POST
exports.list_add_user = [
  // Validate and sanitize fields.
  body("email")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Email must be specified")
    .isEmail()
    .withMessage("Input must be a valid email format"),
  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      List.findOne({ _id: req.params.id, users: req.user.id })
        .populate("owner")
        .populate("users")
        .exec(function (err, list) {
          if (err) {
            next(err);
          }
          // Re-Render the list share form with errors
          res.render("list_share", {
            title: "Share List - Grocery List App",
            page_title: "Share List",
            user: req.user,
            list,
            errors: errors.array(),
          });
        });
    } else {
      // If no validation errors
      async.parallel(
        {
          // Try to find if user email exist in registered users list
          user(callback) {
            User.findOne({ email: req.body.email }).exec(callback);
          },
          list(callback) {
            List.findOne({ _id: req.params.id, users: req.user.id })
              .populate("owner")
              .populate("users")
              .exec(callback);
          },
        },
        (err, results) => {
          if (err) {
            next(err);
          }
          // User is already registered in database
          if (results.user) {
            // Check if user is already in sharing list
            for (let user of results.list.users) {
              // User is in list
              if (user.id === results.user.id) {
                try {
                  throw new Error("User already has access to list");
                } catch (err) {
                  // Re-Render the list share form with errors
                  res.render("list_share", {
                    title: "Share List - Grocery List App",
                    page_title: "Share List",
                    user: req.user,
                    list: results.list,
                    error: err,
                  });
                  return;
                }
              }
            }
            // User is not in sharing list
            List.updateOne(
              { _id: req.params.id, users: req.user.id },
              { $push: { users: results.user._id } }
            ).exec(function (err) {
              if (err) {
                next(err);
              }
              // Redirects to the list share page
              res.redirect(`${results.list.url}/share`);
            });
          } else {
            console.log("USER IS NOT REGISTERED");
            invitationController.list_add_invitation(req, res, next);
          }
        }
      );
    }
  },
];

// Dashboard remove LIST USER on GET
exports.list_remove_user = (req, res, next) => {
  List.updateOne(
    { _id: req.params.listId, users: req.user.id },
    { $pull: { users: req.params.userId } }
  ).exec(function (err) {
    if (err) {
      next(err);
    }
    // Redirects to the list share page
    res.redirect(`/dashboard/list/${req.params.listId}/share`);
  });
};
