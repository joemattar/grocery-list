const List = require("../models/List");
const Invitation = require("../models/Invitation");

const async = require("async");

// Middleware that resolves all the pending invites for the invited user email
module.exports.resolve_pending_invitations = function (req, res, next) {
  // ADD CODE
  // ADD CODE
  // ADD CODE
  next();
};

// Dashboard add UNREGISTERED LIST USER on POST
module.exports.list_add_invitation = function (req, res, next) {
  // ADD CODE
  // ADD CODE
  // ADD CODE
  // Check if email is not already in registered users
  // Should this middleware be nested in add registered user middleware??
  next();
};
