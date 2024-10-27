const express = require("express");
const router = express.Router();
const categoryControllers = require("../../controllers/category-controllers");

router.get("/:categoryId", categoryControllers.getCateogory);
router.put("/:categoryId", categoryControllers.editCategory);
router.delete("/:categoryId", categoryControllers.deleteCategory);
router.get("/:workspaceId/all", categoryControllers.getCategoriesByWorkspace);
router.post("/", categoryControllers.addCategory);

module.exports = router;
