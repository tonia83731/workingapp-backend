const express = require("express");
const router = express.Router();
const passport = require("../../config/passport");
const userControllers = require("../../controllers/user-controllers");
const { authenticated } = require("../../middleware/api-auth");

router.get("/:userId", authenticated, userControllers.getUser);
router.put("/:userId", authenticated, userControllers.updatedUser);
router.get("/", authenticated, userControllers.getUsers);
router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  userControllers.login
);
router.post("/register", userControllers.register);

module.exports = router;
