const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const todoSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 30,
    },
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    bucketId: {
      // noname todo add to default
      type: Schema.Types.ObjectId,
      ref: "Bucket",
    },
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    note: {
      type: String,
      maxlength: 1024,
    },
  },
  { timestamps: true }
);

const todoModel = mongoose.model("Todo", todoSchema);
module.exports = todoModel;
