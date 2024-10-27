const Todo = require("../models/todo-models");
const Bucket = require("../models/bucket-models");
const {
  sendErrorResponse,
  sendSuccessResponse,
} = require("../helpers/resHelpers");

const todoControllers = {
  createTodo: async (req, res) => {
    try {
      const {
        title,
        workspaceId,
        categoryId,
        bucketId,
        users,
        startDate,
        endDate,
        note,
      } = req.body;
      if (!title || !title.trim())
        return sendErrorResponse(res, 400, "Title cannot be blank.");
      if (!workspaceId)
        return sendErrorResponse(res, 400, "WorkspaceId cannot be blank.");
      if (startDate && endDate) {
        let start = new Date(startDate);
        let end = new Date(endDate);
        if (start > end) {
          return sendErrorResponse(
            res,
            400,
            "StartDate must be earlier than endDate."
          );
        }
      }

      let default_bucketId = bucketId;
      if (!bucketId || bucketId === "") {
        const defaultBucket = await Bucket.findOne({
          workspaceId,
          name: "Default",
        });

        // Check if defaultBucket exists
        //  if (!defaultBucket) {
        //    return sendErrorResponse(res, 400, "Default bucket not found.");
        //  }
        default_bucketId = defaultBucket._id;
      }

      const todo = await Todo.create({
        title,
        workspaceId,
        ...(categoryId && categoryId.trim() && { categoryId }),
        bucketId: default_bucketId,
        users: users ? users : [],
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
        ...(note && note.trim() && { note }),
      });

      return sendSuccessResponse(res, 201, {
        message: "Create todo success.",
        todo,
      });
    } catch (error) {
      console.log(error);
      return sendErrorResponse(res, 500, "Server error occurred.");
    }
  },
  getTodoByBucket: async (req, res) => {
    try {
      const { bucketId } = req.params;
      const todos = await Todo.find({ bucketId });
      return sendSuccessResponse(res, 201, {
        todos,
      });
    } catch (error) {
      console.log(error);
      return sendErrorResponse(res, 500, "Server error occurred.");
    }
  },
  getTodoById: async (req, res) => {
    try {
      const { todoId } = req.params;
      const todo = await Todo.findById(todoId);

      if (!todo) return sendErrorResponse(res, 404, "Todo do not exist.");
      return sendSuccessResponse(res, 201, {
        todo,
      });
    } catch (error) {
      console.log(error);
      return sendErrorResponse(res, 500, "Server error occurred.");
    }
  },
  updateTodo: async (req, res) => {
    try {
      const { todoId } = req.params;
      const { title, categoryId, bucketId, startDate, endDate, note, users } =
        req.body;

      if (!title || !title.trim())
        return sendErrorResponse(res, 400, "Title cannot be blank.");

      if (startDate && endDate) {
        let start = new Date(startDate);
        let end = new Date(endDate);
        if (start > end) {
          return sendErrorResponse(
            res,
            400,
            "StartDate must be earlier than endDate."
          );
        }
      }

      // users should avoid not in the workspace

      const todo = await Todo.findById(todoId);
      todo.title = title || todo.title;
      todo.categoryId = categoryId || todo.categoryId;
      todo.bucketId = bucketId || todo.bucketId;
      todo.startDate = startDate || todo.startDate;
      todo.endDate = endDate || todo.endDate;
      todo.note = note || todo.note;
      todo.users = users || todo.users;

      await todo.save();

      return sendSuccessResponse(res, 200, {
        message: "Todo updated successfully.",
        todo,
      });
    } catch (error) {
      console.log(error);
      return sendErrorResponse(res, 500, "Server error occurred.");
    }
  },
  moveTodo: async (req, res) => {
    try {
      const { todoId } = req.params;
      const { bucketId } = req.body;

      const todo = await Todo.findById(todoId);
      const bucket = await Bucket.findById(bucketId);

      if (!todo) return sendErrorResponse(res, 404, "Todo does not exist.");
      if (!bucket) return sendErrorResponse(res, 404, "Bucket does not exist.");

      todo.bucketId = bucketId || todo.bucketId;
      await todo.save();

      return sendSuccessResponse(res, 200, {
        message: "Todo moved successfully.",
        todo,
      });
    } catch (error) {
      console.log(error);
      return sendErrorResponse(res, 500, "Server error occurred.");
    }
  },
  checkedTodo: async (req, res) => {
    try {
      const { todoId } = req.params;
      const todo = await Todo.findById(todoId);
      if (!todo) return sendErrorResponse(res, 404, "Todo do not exist.");

      todo.isCompleted = !todo.isCompleted;
      const checked_todo = await todo.save();

      return sendSuccessResponse(res, 200, {
        message: `Todo is ${
          checked_todo.isCompleted ? "checked" : "unchecked"
        }`,
        todo: checked_todo,
      });
    } catch (error) {
      console.log(error);
      return sendErrorResponse(res, 500, "Server error occurred.");
    }
  },
  deleteTodo: async (req, res) => {
    try {
      const { todoId } = req.params;
      const todo = await Todo.findById(todoId);
      if (!todo) return sendErrorResponse(res, 404, "Todo do not exist.");

      const remove_todo = await todo.deleteOne({ _id: todoId });

      return sendSuccessResponse(res, 200, {
        todo: remove_todo,
        message: "Todo delete success.",
      });
    } catch (error) {
      console.log(error);
      return sendErrorResponse(res, 500, "Server error occurred.");
    }
  },
};

module.exports = todoControllers;
