const List = require("../models/List");
const User = require("../models/User");
const Item = require("../models/Item");

const async = require("async");
const { body, validationResult } = require("express-validator");

// Display item create form on GET.
module.exports.item_create_get = (req, res, next) => {
  // Successful, so render.
  res.render("item_form", {
    title: "Add Item - Grocery List App",
    user: req.user,
    list_id: req.params.id,
  });
};

// Handle item create on POST.
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

// Display item edit form on GET.
module.exports.item_edit_get = (req, res, next) => {
  Item.findOne({ _id: req.params.id }).exec(function (err, item) {
    if (err) {
      return next(err);
    }
    // Successful, so render.
    res.render("item_form", {
      title: "Edit Item - Grocery List App",
      user: req.user,
      item,
      list_id: item.list,
    });
  });
};

// Display item edit form on POST.
module.exports.item_edit_post = [
  // Validate and sanitize fields.
  body("name", "Item name must be specified").trim().isLength({ min: 1 }),
  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
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
          title: "Update Item - Grocery List App",
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

// Handle item delete on GET.
module.exports.item_delete_get = (req, res, next) => {
  Item.findOne({ _id: req.params.id }).exec(function (err, item) {
    if (err) {
      return next(err);
    }
    const list_url = `/dashboard/list/${item.list}`;
    Item.deleteOne({ _id: req.params.id }).exec(function (err) {
      if (err) {
        return next(err);
      }
      // Success - go to list
      res.redirect(list_url);
    });
  });
};
