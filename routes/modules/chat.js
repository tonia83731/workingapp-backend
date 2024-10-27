const express = require("express");
const router = express.Router();
const chatControllers = require("../../controllers/chat-controllers");

router.get("/:workspaceId", chatControllers.getChat);

module.exports = router;
