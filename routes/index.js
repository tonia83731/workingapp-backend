const express = require("express");
const router = express.Router();
const { authenticated } = require("../middleware/api-auth");
const users = require("./modules/user");
const todos = require("./modules/todo");
const notifications = require("./modules/notification");
const messages = require("./modules/message");
const chats = require("./modules/chat");
const categories = require("./modules/category");
const buckets = require("./modules/bucket");
const workspace = require("./modules/workspace");

router.use("/buckets", authenticated, buckets);
router.use("/todos", authenticated, todos);
router.use("/categories", authenticated, categories);
router.use("/chats", authenticated, chats);
router.use("/notifications", authenticated, notifications);
router.use("/messages", authenticated, messages);
router.use("/workspaces", authenticated, workspace);
router.use("/users", users);

module.exports = router;
