const express = require("express");
const router = express.Router();
const isAuthorized = require("../controllers/authentication");
const invitationController = require("../controllers/invitationController");
const listController = require("../controllers/listController");
const itemController = require("../controllers/itemController");

// Dashboard display USER LISTS on GET
// Route GET /dashboard
router.get(
  "/",
  isAuthorized,
  invitationController.resolve_pending_invitations,
  listController.user_lists
);

// Dashboard create USER LIST on GET
// Route GET /dashboard/list/create
router.get("/list/create", isAuthorized, listController.list_create_get);

// Dashboard create USER LIST on POST
// Route POST /dashboard/list/create
router.post("/list/create", isAuthorized, listController.list_create_post);

// Dashboard display USER LIST details on GET
// Route GET /dashboard/list/:id
router.get("/list/:id", isAuthorized, listController.list_detail);

// Dashboard edit USER LIST on GET
// Route GET /dashboard/list/:id/edit
router.get("/list/:id/edit", isAuthorized, listController.list_edit_get);

// Dashboard edit USER LIST on POST
// Route POST /dashboard/list/:id/edit
router.post("/list/:id/edit", isAuthorized, listController.list_edit_post);

// Dashboard delete USER LIST on GET
// Route GET /dashboard/list/:id/delete
router.get("/list/:id/delete", isAuthorized, listController.list_delete_get);

// Dashboard delete USER LIST on POST
// Route POST /dashboard/list/:id/delete
router.post("/list/:id/delete", isAuthorized, listController.list_delete_post);

// Dashboard display USER LIST SHARE on GET
// Route GET /dashboard/list/:id/share
router.get("/list/:id/share", isAuthorized, listController.list_share_get);

// Dashboard add LIST USER on POST
// Route POST /dashboard/list/:id/share
router.post("/list/:id/share", isAuthorized, listController.list_add_user);

// Dashboard remove LIST USER on GET
// Route GET /dashboard/list/:listId/user/:userId/remove
router.get(
  "/list/:listId/user/:userId/remove",
  isAuthorized,
  listController.list_remove_user
);

// Dashboard remove UNREGISTERED LIST USER (invitation) on GET
// Route GET /dashboard/list/:listId/invitation/:invitationId/remove
router.get(
  "/list/:listId/invitation/:invitationId/remove",
  isAuthorized,
  invitationController.list_remove_invitation
);

// Dashboard create LIST ITEM on GET
// Route GET /dashboard/list/:id/item/create
router.get(
  "/list/:id/item/create",
  isAuthorized,
  itemController.item_create_get
);

// Dashboard create LIST ITEM on POST
// Route POST /dashboard/list/:id/item/create
router.post(
  "/list/:id/item/create",
  isAuthorized,
  itemController.item_create_post
);

// Dashboard edit LIST ITEM on GET
// Route GET /dashboard/item/:id/edit
router.get("/item/:id/edit", isAuthorized, itemController.item_edit_get);

// Dashboard edit LIST ITEM on POST
// Route POST /dashboard/item/:id/edit
router.post("/item/:id/edit", isAuthorized, itemController.item_edit_post);

// Dashboard delete LIST ITEM on GET
// Route GET /dashboard/item/:id/delete
router.get("/item/:id/delete", isAuthorized, itemController.item_delete_get);

// Dashboard toggle LIST ITEM status on GET
// Route GET /dashboard/item/:id/toggle
router.get("/item/:id/toggle", isAuthorized, itemController.item_toggle_get);

module.exports = router;
