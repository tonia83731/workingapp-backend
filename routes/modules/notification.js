const express = require("express");
const router = express.Router();
const notificationControllers = require("../../controllers/notification-controllers");

router.get(
  "/:recipientId",
  notificationControllers.countNotificationsByRecipient
);
router.put("/:recipientId", notificationControllers.readAllNotifications);

module.exports = router;
