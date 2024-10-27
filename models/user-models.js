const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
      maxlength: 200,
    },
    password: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
      maxlength: 1024,
    },
    description: {
      type: String,
      maxlength: 1024,
    },
    image: {
      type: String,
      default:
        "https://media.istockphoto.com/id/885240276/vector/male-avatar-profile-picture-silhouette-light-shadow.jpg?s=170667a&w=0&k=20&c=Ly-lffKHosx3R8yi5CnCGx1tkJs8u63Kgnih6jTr7GU=",
    },
  },
  { timestamps: true }
);

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
