const List = require("../models/List");
const Invitation = require("../models/Invitation");

const async = require("async");
const { list_remove_user } = require("./listController");

// Middleware that resolves all the pending invites for the invited user email
module.exports.resolve_pending_invitations = function (req, res, next) {
  // ADD CODE
  // ADD CODE
  // ADD CODE
  next();
};

// Dashboard add UNREGISTERED LIST USER on POST
module.exports.list_add_invitation = function (req, res, next) {
  const listId = req.params.id;
  // Check if email is not already in registered users
  Invitation.findOne({ list: req.params.id, email: req.body.email })
    .populate("list")
    .exec(function (err, invitation) {
      if (err) {
        next(err);
      }
      // If email already invited to share list
      if (invitation) {
        try {
          throw new Error("Email already invited to share list");
        } catch (err) {
          // Re-Render the list share form with errors
          res.render("list_share", {
            title: "Share List - Grocery List App",
            page_title: "Share List",
            user: req.user,
            list: invitation.list,
            error: err,
          });
        }
        // If email not already invited to share list
      } else {
        const invitation = new Invitation({
          list: listId,
          email: req.body.email,
        });
        // Validation is not coded here as it is coded
        // in the middleware that calls this one
        // Save new MongoDB invitation object
        invitation.save((err) => {
          if (err) {
            return next(err);
          }
          // Successful: redirect to new record.
          res.redirect(`/dashboard/list/${listId}/share`);
        });
      }
    });
};
