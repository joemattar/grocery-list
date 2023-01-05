const List = require("../models/List");
const Invitation = require("../models/Invitation");

const async = require("async");

// Middleware that resolves all the pending invites for the invited user email
module.exports.resolve_pending_invitations = function (req, res, next) {
  // Find all pending invitations related to current user
  Invitation.find({ email: req.user.email }).exec(function (err, invitations) {
    if (err) {
      return next(err);
    }
    console.log("INVITATIONS ARRAY - NEXT LINE:");
    console.log(invitations);
    // If the user has pending invitation
    if (invitations.length > 0) {
      console.log("INVITATIONS EXIST");
      // Add the current user as user in all the related invitation lists
      for (let invitation of invitations) {
        List.updateOne(
          { _id: invitation.list },
          { $push: { users: req.user._id } }
        ).exec(function (err) {
          if (err) {
            next(err);
          }
          // Then delete invitation
          Invitation.deleteOne({
            _id: invitation._id,
          }).exec(function (err) {
            if (err) {
              next(err);
            }
          });
        });
      }
      // If the user does not have pending invitation
    }
  });
  next();
};

// Dashboard add UNREGISTERED LIST USER (invitation) on POST
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

// Dashboard remove UNREGISTERED LIST USER (invitation) on GET
module.exports.list_remove_invitation = function (req, res, next) {
  Invitation.deleteOne({
    _id: req.params.invitationId,
    list: req.params.listId,
  }).exec(function (err) {
    if (err) {
      next(err);
    }
    // Redirects to the list share page
    res.redirect(`/dashboard/list/${req.params.listId}/share`);
  });
};
