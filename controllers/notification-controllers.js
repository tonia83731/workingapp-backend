const Notification = require("../models/notification-models");
const {
  sendErrorResponse,
  sendSuccessResponse,
} = require("../helpers/resHelpers");

const notificationControllers = {
  countNotificationsByRecipient: async (req, res) => {
    try {
      const { recipientId } = req.params;
      const notificationCount = await Notification.countDocuments({
        recipientId,
      });
      return sendSuccessResponse(res, 201, {
        count: notificationCount,
      });
    } catch (error) {
      console.log(error);
      return sendErrorResponse(res, 500, "Server error occurred.");
    }
  },
  readAllNotifications: async (req, res) => {
    try {
      const { recipientId } = req.params;

      const notifications = await Notification.find({
        recipientId,
        isRead: false,
      });

      if (notifications.length === 0)
        return sendSuccessResponse(res, 200, {
          success: true,
          message: "No unread notifications",
        });
      await Notification.updateMany(
        {
          recipientId,
          isRead: false,
        },
        {
          $set: { isRead: true },
        }
      );
      return sendSuccessResponse(res, 200, {
        success: true,
        message: "All notifications marked as read",
      });
    } catch (error) {
      console.log(error);
      return sendErrorResponse(res, 500, "Server error occurred.");
    }
  },
};

module.exports = notificationControllers;
