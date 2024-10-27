const User = require("../models/user-models");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  sendErrorResponse,
  sendSuccessResponse,
} = require("../helpers/resHelpers");

const userControllers = {
  register: async (req, res) => {
    try {
      const { name, email, password, confirmPassword } = req.body;
      if (
        !name ||
        !name.trim() ||
        !email ||
        !email.trim() ||
        !password ||
        !password.trim() ||
        !confirmPassword ||
        !confirmPassword.trim()
      )
        return sendErrorResponse(
          res,
          400,
          "Name, email, password, confirmPassword cannot be blank."
        );
      if (name.length < 3 || name.length > 12)
        return sendErrorResponse(res, 400, "Name length should between 3-12.");
      if (!validator.isEmail(email))
        return sendErrorResponse(res, 400, "Invalid email.");
      if (password !== confirmPassword)
        return sendErrorResponse(
          res,
          400,
          "Password and confirmPassword do not matched."
        );

      const isExisted = await User.findOne({ email });
      if (isExisted)
        return sendErrorResponse(res, 400, "User already existed.");

      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);

      const user = await User.create({
        name,
        email,
        password: hash,
      });
      return sendSuccessResponse(res, 201, {
        message: "User created!",
        user: {
          ...user.toJSON(),
          password: undefined,
        },
      });
    } catch (error) {
      console.log(error);
      return sendErrorResponse(res, 500, "Server error occurred.");
    }
  },
  login: async (req, res) => {
    try {
      const user = req.user.toJSON();
      delete user.password;
      const token = jwt.sign(user, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      return sendSuccessResponse(res, 200, {
        user,
        token,
      });
    } catch (err) {
      console.log(err);
      sendErrorResponse(res, 500, `Server error: ${err}`);
    }
  },
  getUser: async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await User.findById(userId).lean();
      if (!user) return sendErrorResponse(res, 404, "User do not existed.");
      delete user.password;
      return sendSuccessResponse(res, 200, user);
    } catch (error) {
      console.log(error);
      return sendErrorResponse(res, 500, "Server error occurred.");
    }
  },
  getUsers: async (req, res) => {
    try {
      const users = await User.find().lean();
      return sendSuccessResponse(res, 201, users);
    } catch (error) {
      console.log(error);
      return sendErrorResponse(res, 500, "Server error occurred.");
    }
  },
  updatedUser: async (req, res) => {
    try {
      // const curr_user = req.user;
      // console.log(curr_user);
      const { userId } = req.params;
      const { name, description, image } = req.body;

      if (name.length < 3 || name.length > 12)
        return sendErrorResponse(res, 400, "Name length should between 3-12.");
      if (description.length > 300)
        return sendErrorResponse(
          res,
          400,
          "Description length should below 300."
        );
      const user = await User.findById(userId);
      if (!user) return sendErrorResponse(res, 404, "User do not existed.");

      // if (curr_user._id.toString() !== user._id.toString())
      //   return sendErrorResponse(res, 403, "Permission denied");
      user.name = name === "" ? user.name : name;
      user.description = description === "" ? user.description : description;
      user.image = image === "" ? user.image : image;

      const update_user = await user.save();

      return sendSuccessResponse(res, 200, {
        message: "User updated!",
        user: {
          ...update_user.toJSON(),
          password: undefined,
        },
      });
    } catch (error) {
      console.log(error);
      return sendErrorResponse(res, 500, "Server error occurred.");
    }
  },
};

module.exports = userControllers;
