const express = require("express");
const router = express.Router();
const todoControllers = require("../../controllers/todo-controllers");

router.get("/:todoId", todoControllers.getTodoById);
router.put("/:todoId", todoControllers.updateTodo);
router.delete("/:todoId", todoControllers.deleteTodo);
router.get("/bucket/:bucketId", todoControllers.getTodoByBucket);
router.put("/moved/:todoId", todoControllers.moveTodo);
router.put("/completed/:todoId", todoControllers.checkedTodo);
router.post("/", todoControllers.createTodo);

module.exports = router;
