const Bucket = require("../models/bucket-models");
const Todo = require("../models/todo-models");
const {
  sendErrorResponse,
  sendSuccessResponse,
} = require("../helpers/resHelpers");
const bucketControllers = {
  getBucketsByWorkspace: async (req, res) => {
    try {
      const { workspaceId } = req.params;
      const buckets = await Bucket.find({ workspaceId }).lean();
      return sendSuccessResponse(res, 200, {
        buckets,
      });
    } catch (error) {
      console.log(error);
      return sendErrorResponse(res, 500, "Server error occurred.");
    }
  },
  getBucket: async (req, res) => {
    try {
      const { bucketId } = req.params;
      const bucket = await Bucket.findById(bucketId);
      if (!bucket) return sendErrorResponse(res, 404, "Bucket do not exist.");

      return sendSuccessResponse(res, 200, {
        bucket,
      });
    } catch (error) {
      console.log(error);
      return sendErrorResponse(res, 500, "Server error occurred.");
    }
  },

  createBucket: async (req, res) => {
    try {
      const { workspaceId, name } = req.body;
      if (!name || !name.trim())
        return sendErrorResponse(res, 400, "Bucket name cannot be blank.");
      if (!workspaceId)
        return sendErrorResponse(res, 400, "WorkspaceId cannot be blank.");
      const isExisted = await Bucket.findOne({ name });
      if (isExisted) return sendErrorResponse(res, 400, "Bucket name repeat.");
      const bucket = await Bucket.create({ workspaceId, name });

      return sendSuccessResponse(res, 201, {
        message: "Bucket created success.",
        bucket,
      });
    } catch (error) {
      console.log(error);
      return sendErrorResponse(res, 500, "Server error occurred.");
    }
  },
  editBucket: async (req, res) => {
    try {
      const { bucketId } = req.params;
      const { name } = req.body;
      const bucket = await Bucket.findById(bucketId);
      if (!bucket) return sendErrorResponse(res, 404, "Bucket do not exist.");
      bucket.name = name === "" ? bucket.name : name;

      const update_bucket = await bucket.save();
      return sendSuccessResponse(res, 201, {
        message: "Bucket updated success.",
        bucket: update_bucket,
      });
    } catch (error) {
      console.log(error);
      return sendErrorResponse(res, 500, "Server error occurred.");
    }
  },
  deleteBucket: async (req, res) => {
    try {
      const { bucketId } = req.params;
      const bucket = await Bucket.findById(bucketId);
      if (!bucket) return sendErrorResponse(res, 404, "Bucket do not exist.");
      const todos = await Todo.find({ bucketId });
      let remove_todos = null;
      if (todos.length > 0) {
        remove_todos = await Todo.deleteMany({ bucketId });
      }
      if (bucket.name === "Default") {
        return sendErrorResponse(res, 403, "Cannot delete the Default bucket.");
      }

      const remove_bucket = await Bucket.deleteOne({ _id: bucketId });
      return sendSuccessResponse(res, 201, {
        message: "Bucket and related todos remove success.",
        bucket: remove_bucket,
        todos: remove_todos,
      });
    } catch (error) {
      console.log(error);
      return sendErrorResponse(res, 500, "Server error occurred.");
    }
  },
};

module.exports = bucketControllers;
