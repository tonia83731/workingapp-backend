const express = require("express");
const router = express.Router();
const messageControllers = require("../../controllers/message-controllers");

router.get("/:chatId", messageControllers.getMessages);
router.delete("/:messageId", messageControllers.deleteMessage);
router.post("/", messageControllers.createMessage);

module.exports = router;
