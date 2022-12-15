const express = require("express");
const router = express.Router();
const isAuthorized = require("../controllers/authentication");
const listController = require("../controllers/listController");
const itemController = require("../controllers/itemController");

// Dashboard user grocery lists page
// Route GET /dashboard
router.get("/", isAuthorized, listController.user_lists);

// Dashboard user create list page
// Route GET /dashboard/list/create
router.get("/list/create", isAuthorized, listController.list_create_get);

// Dashboard user create list page
// Route POST /dashboard/list/create
router.post("/list/create", isAuthorized, listController.list_create_post);

// Dashboard user list details page
// Route GET /dashboard/list/:id
router.get("/list/:id", isAuthorized, listController.list_detail);

// Dashboard user create list item page
// Route GET /dashboard/list/:id/item/create
router.get(
  "/list/:id/item/create",
  isAuthorized,
  itemController.item_create_get
);

// Dashboard user create list item page
// Route POST /dashboard/list/:id/item/create
router.post(
  "/list/:id/item/create",
  isAuthorized,
  itemController.item_create_post
);

// Dashboard user edit list item page
// Route GET /dashboard/item/:id/edit
router.get("/item/:id/edit", isAuthorized, itemController.item_edit_get);

// Dashboard user edit list item page
// Route POST /dashboard/item/:id/edit
router.post("/item/:id/edit", isAuthorized, itemController.item_edit_post);

// Dashboard user delete list item page
// Route GET /dashboard/item/:id/delete
router.get("/item/:id/delete", isAuthorized, itemController.item_delete_get);

module.exports = router;
