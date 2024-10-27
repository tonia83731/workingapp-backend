const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const workspaceSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 30,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    users: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const workspaceModel = mongoose.model("Workspace", workspaceSchema);
module.exports = workspaceModel;
