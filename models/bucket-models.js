const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bucketSchema = new Schema(
  {
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 30,
    },
  },
  { timestamps: true }
);

const bucketModel = mongoose.model("Bucket", bucketSchema);
module.exports = bucketModel;
