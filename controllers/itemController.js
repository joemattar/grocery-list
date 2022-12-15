const List = require("../models/List");
const Item = require("../models/Item");

const async = require("async");
const { body, validationResult } = require("express-validator");

// Dashboard create LIST ITEM page on GET
module.exports.item_create_get = (req, res, next) => {
  List.findOne({ _id: req.params.id, users: req.user.id }).exec(function (
    err,
    list
  ) {
    if (err) {
      next(err);
    }
    // Successful, so render.
    res.render("item_form", {
      title: "Add Item - Grocery List App",
      page_title: "Add Item",
      user: req.user,
      list,
    });
  });
};

// Dashboard create LIST ITEM page on POST
exports.item_create_post = [
  // Validate and sanitize fields.
  body("name", "Item name must be specified").trim().isLength({ min: 1 }),
  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    // Create an Item object with trimmed data.
    const item = new Item({
      name: req.body.name,
      list: req.params.id,
      status: "to-do",
    });
    if (!errors.isEmpty()) {
      // There are errors.
      // Render form again with sanitized values and error messages.
      res.render("item_form", {
        title: "Update Item - Grocery List App",
        page_title: "Add Item",
        user: req.user,
        item,
        errors: errors.array(),
      });
      return;
    }
    // Data from form is valid.
    item.save((err) => {
      if (err) {
        return next(err);
      }
      List.findOne({ _id: req.params.id }).exec(function (err, list) {
        if (err) {
          return next(err);
        }
        // Successful: redirect back to list.
        res.redirect(list.url);
      });
    });
  },
];

// Dashboard edit LIST ITEM page on GET
module.exports.item_edit_get = (req, res, next) => {
  Item.findOne({ _id: req.params.id }).exec(function (err, item) {
    if (err) {
      return next(err);
    }
    List.findOne({ _id: item.list, users: req.user.id }).exec(function (
      err,
      list
    ) {
      if (err) {
        return next(err);
      }
      // Successful, so render.
      res.render("item_form", {
        title: "Edit Item - Grocery List App",
        page_title: "Edit Item",
        user: req.user,
        item: item,
        list: list,
      });
    });
  });
};

// Dashboard edit LIST ITEM page on POST
module.exports.item_edit_post = [
  // Validate and sanitize fields.
  body("name", "Item name must be specified").trim().isLength({ min: 1 }),
  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    // Find the item in db
    Item.findOne({ _id: req.params.id }).exec(function (err, selected_item) {
      if (err) {
        next(err);
      }
      // Create an Item object with trimmed data.
      const item = new Item({
        name: req.body.name,
        list: selected_item.list,
        status: "to-do",
      });
      if (!errors.isEmpty()) {
        // There are errors.
        // Render form again with sanitized values and error messages.
        res.render("item_form", {
          title: "Add Item - Grocery List App",
          page_title: "Add Item",
          user: req.user,
          item,
          errors: errors.array(),
        });
        return;
      }
      Item.updateOne({ _id: req.params.id }, { name: req.body.name }).exec(
        function (err) {
          if (err) {
            return next(err);
          }
          // Successful: redirect back to list.
          res.redirect(`/dashboard/list/${selected_item.list}`);
        }
      );
    });
  },
];

// Dashboard delete LIST ITEM page on GET
module.exports.item_delete_get = (req, res, next) => {
  Item.findOne({ _id: req.params.id }).exec(function (err, item) {
    if (err) {
      return next(err);
    }
    List.findOne({ _id: item.list, users: req.user.id }).exec(function (
      err,
      list
    ) {
      if (err) {
        return next(err);
      }
      Item.deleteOne({ _id: req.params.id }).exec(function (err) {
        if (err) {
          return next(err);
        }
        // Success - go to list
        res.redirect(list.url);
      });
    });
  });
};

// Dashboard toggle LIST ITEM status on GET
module.exports.item_toggle_get = (req, res, next) => {
  Item.findOne({ _id: req.params.id })
    .populate("list")
    .exec(function (err, item) {
      if (err) {
        next(err);
      }
      if (item.list.users.includes(req.user.id)) {
        if (item.status === "to-do") {
          Item.updateOne({ _id: req.params.id }, { status: "done" }).exec(
            function (err) {
              if (err) {
                next(err);
              }
              res.redirect(item.list.url);
            }
          );
        } else if (item.status === "done") {
          Item.updateOne({ _id: req.params.id }, { status: "to-do" }).exec(
            function (err) {
              if (err) {
                next(err);
              }
              res.redirect(item.list.url);
            }
          );
        }
      }
    });
};
