const Chat = require("../models/chat-models");
const {
  sendErrorResponse,
  sendSuccessResponse,
} = require("../helpers/resHelpers");

const chatControllers = {
  getChat: async (req, res) => {
    try {
      const { workspaceId } = req.params;

      const chat = await Chat.find({ workspaceId })
        .populate("members", "-password")
        .populate("lastestMessage")
        .lean();
      if (!chat) return sendErrorResponse(res, 404, "Chat does not exist!");
      return sendSuccessResponse(res, 200, {
        chat,
      });
    } catch (error) {
      console.log(error);
      return sendErrorResponse(res, 500, "Server error occurred.");
    }
  },
};

module.exports = chatControllers;
