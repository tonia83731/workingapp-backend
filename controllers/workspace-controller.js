const WorkSpace = require("../models/workspace-models");
const User = require("../models/user-models");
const Chat = require("../models/chat-models");
const Bucket = require("../models/bucket-models");
const Category = require("../models/category-models");
const {
  sendErrorResponse,
  sendSuccessResponse,
} = require("../helpers/resHelpers");

const workspaceController = {
  createWorkspace: async (req, res) => {
    try {
      const { userId, name } = req.body;
      if (!name) return sendErrorResponse(res, 400, "Name cannot be blank.");
      const user = await User.findById(userId);
      if (!user) return sendErrorResponse(res, 404, "User do not existed.");
      const workspace = await WorkSpace.create({
        name,
        owner: userId,
        users: [userId],
      });

      const chat = await Chat.create({
        workspaceId: workspace._id,
        members: [userId],
      });

      const bucket = await Bucket.create({
        workspaceId: workspace._id,
        name: "Default",
      });

      const category_data = [
        { name: "Work", tagColor: "#FF5733", workspaceId: workspace._id },
        { name: "Personal", tagColor: "#33FF57", workspaceId: workspace._id },
        {
          name: "Health & Fitness",
          tagColor: "#3357FF",
          workspaceId: workspace._id,
        },
        {
          name: "Family & Friends",
          tagColor: "#F3FF33",
          workspaceId: workspace._id,
        },
      ];

      const categories = await Category.insertMany(category_data);

      return sendSuccessResponse(res, 201, {
        message: "Workspace and chat created!",
        workspace,
        chat,
        bucket,
        categories,
      });
    } catch (err) {
      console.log(err);
      sendErrorResponse(res, 500, `Server error: ${err}`);
    }
  },
  addUserToWorkspace: async (req, res) => {
    try {
      const { workspaceId, ownerId, userId } = req.body;
      // const checked_permission = await WorkSpace.find({ owner: ownerId });
      const [workspace, chat, checked_permission] = await Promise.all([
        WorkSpace.findById(workspaceId),
        Chat.findOne({ workspaceId }),
        WorkSpace.findOne({ _id: workspaceId, owner: ownerId }),
      ]);
      if (!workspace)
        return sendErrorResponse(res, 404, "Workspace do not existed.");
      if (!chat) return sendErrorResponse(res, 404, "Chat do not existed.");
      if (!checked_permission)
        return sendErrorResponse(
          res,
          403,
          "Permission denied - Only the workspace owner can add users."
        );

      if (workspace.users.includes(userId))
        return sendErrorResponse(
          res,
          200,
          "User is already a member of the workspace."
        );
      workspace.users.push(userId);
      chat.members.push(userId);

      const [updatedWorkspace, updatedChat] = await Promise.all([
        workspace.save(),
        chat.save(),
      ]);

      return sendSuccessResponse(res, 201, {
        message: "New user added!",
        workspace: updatedWorkspace,
        chat: updatedChat,
      });
    } catch (err) {
      console.log(err);
      sendErrorResponse(res, 500, `Server error: ${err}`);
    }
  },
  removeUserFromWorkspace: async (req, res) => {
    try {
      const { workspaceId, ownerId, userId } = req.body;
      const [workspace, chat, checked_permission] = await Promise.all([
        WorkSpace.findById(workspaceId),
        Chat.findOne({ workspaceId }),
        WorkSpace.findOne({ _id: workspaceId, owner: ownerId }),
      ]);
      if (!workspace)
        return sendErrorResponse(res, 404, "Workspace do not existed.");
      if (!chat) return sendErrorResponse(res, 404, "Chat do not existed.");
      if (!checked_permission)
        return sendErrorResponse(
          res,
          403,
          "Permission denied - Only the workspace owner can add users."
        );
      if (!workspace.users.includes(userId))
        return sendErrorResponse(res, 404, "User no found in workspace");
      workspace.users = workspace.users.filter(
        (user) => user.toString() !== userId
      );
      chat.members = chat.members.filter(
        (member) => member.toString() !== userId
      );

      const [updatedWorkspace, updatedChat] = await Promise.all([
        workspace.save(),
        chat.save(),
      ]);

      return sendSuccessResponse(res, 200, {
        message: "User removed successfully!",
        workspace: updatedWorkspace,
        chat: updatedChat,
      });
    } catch (err) {
      console.log(err);
      sendErrorResponse(res, 500, `Server error: ${err}`);
    }
  },
  getWorkspace: async (req, res) => {
    try {
      const { workspaceId } = req.params;
      const workspace = await WorkSpace.findById(workspaceId);
      if (!workspace)
        return sendErrorResponse(res, 404, "Workspace do not existed.");
      return sendSuccessResponse(res, 200, {
        workspace,
      });
    } catch (error) {
      console.log(error);
      return sendErrorResponse(res, 500, "Server error occurred.");
    }
  },
  getWorkspacesByUser: async (req, res) => {
    console.log("hello");
    try {
      const { userId } = req.params;
      console.log(userId);
      const workspaces = await WorkSpace.find({ users: { $in: [userId] } });
      console.log(workspaces);
      return sendSuccessResponse(res, 200, {
        workspaces,
      });
    } catch (error) {
      console.log(error);
      return sendErrorResponse(res, 500, "Server error occurred.");
    }
  },
  checkedWorkspacePermission: async (req, res) => {
    try {
      const { workspaceId, userId } = req.body;
      const workspace = await WorkSpace.findById(workspaceId);
      if (!workspace)
        return sendErrorResponse(res, 404, "Workspace do not existed.");

      const has_permission = workspace.users.includes(userId);
      if (!has_permission)
        return sendErrorResponse(
          res,
          403,
          "Permission denied - User is not part of the workspace"
        );

      //   const token = jwt.sign({ userId, workspaceId }, process.env.JWT_SECRET, {
      //     expiresIn: "7d",
      //   });
      return sendSuccessResponse(res, 200, {
        message: "Permission granted!",
      });
    } catch (error) {
      console.log(error);
      return sendErrorResponse(res, 500, "Server error occurred.");
    }
  },
};

module.exports = workspaceController;
