const Message = require("../models/message-models");
const Notification = require("../models/notification-models");
const User = require("../models/user-models");
const Chat = require("../models/chat-models");
const {
  sendErrorResponse,
  sendSuccessResponse,
} = require("../helpers/resHelpers");

const messageControllers = {
  createMessage: async (req, res) => {
    try {
      const { senderId, workspaceId, chatId, text } = req.body;

      if (!senderId || !workspaceId || !chatId || !text || !text.trim())
        return sendErrorResponse(
          res,
          400,
          "SenderId, workspaceId, chatId, text cannot be blank"
        );

      const [user, chat] = await Promise.all([
        User.findById(senderId),
        Chat.findById(chatId),
      ]);
      if (!user) return sendErrorResponse(res, 404, "Sender do not exist.");
      if (!chat) return sendErrorResponse(res, 404, "Chat do not exist.");

      const message = await Message.create({
        senderId,
        workspaceId,
        chatId,
        text,
      });

      const recipientId = chat.members.find(
        (member) => member.toString() !== senderId
      );
      const notification = await Notification.create({
        senderId,
        recipientId,
      });

      return sendSuccessResponse(res, 200, {
        message,
        notification,
      });
    } catch (error) {
      console.log(error);
      return sendErrorResponse(res, 500, "Server error occurred.");
    }
  },
  getMessages: async (req, res) => {
    try {
      const { chatId } = req.params;
      const messages = await Message.find({ chatId });
      return sendSuccessResponse(res, 200, {
        messages,
      });
    } catch (error) {
      console.log(error);
      return sendErrorResponse(res, 500, "Server error occurred.");
    }
  },
  deleteMessage: async (req, res) => {
    try {
      const { messageId } = req.params;
      const { senderId, chatId } = req.body;

      const message = await Message.findById(messageId);
      if (!message) {
        return sendErrorResponse(res, 404, "Message does not exist.");
      }
      if (
        message.senderId.toString() !== senderId ||
        message.chatId.toString() !== chatId
      ) {
        return sendErrorResponse(
          res,
          403,
          "You do not have permission to delete this message."
        );
      }

      message.isDeleted = true;
      await Notification.deleteOne({ text: message.text, senderId });
      await message.save();
      return sendSuccessResponse(res, 200, {
        message: "Message deleted.",
      });
    } catch (error) {
      console.log(error);
      return sendErrorResponse(res, 500, "Server error occurred.");
    }
  },
};

module.exports = messageControllers;
