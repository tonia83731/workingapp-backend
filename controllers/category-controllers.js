const Category = require("../models/category-models");
const Todo = require("../models/todo-models");
const {
  sendErrorResponse,
  sendSuccessResponse,
} = require("../helpers/resHelpers");

const categoryControllers = {
  getCategoriesByWorkspace: async (req, res) => {
    try {
      const { workspaceId } = req.params;
      const categories = await Category.find({ workspaceId }).lean();

      return sendSuccessResponse(res, 200, {
        message: "Get categories success.",
        categories,
      });
    } catch (error) {
      console.log(error);
    }
  },
  getCateogory: async (req, res) => {
    try {
      const { categoryId } = req.params;
      const category = await Category.findById(categoryId);
      if (!category)
        return sendErrorResponse(res, 404, "Category do not exist.");

      return sendSuccessResponse(res, 200, {
        category,
      });
    } catch (error) {
      console.log(error);
      return sendErrorResponse(res, 500, "Server error occurred.");
    }
  },
  addCategory: async (req, res) => {
    try {
      const { name, tagColor, workspaceId } = req.body;
      if (!name) return sendErrorResponse(res, 400, "Name cannot be blank");
      if (!workspaceId)
        return sendErrorResponse(res, 400, "WorkspaceId cannot be blank.");
      const category = await Category.create({
        workspaceId,
        name,
        ...(tagColor !== "" && { tagColor }),
      });
      return sendSuccessResponse(res, 201, {
        message: "Category created!",
        category,
      });
    } catch (error) {
      console.log(error);
      return sendErrorResponse(res, 500, "Server error occurred.");
    }
  },
  editCategory: async (req, res) => {
    try {
      const { categoryId } = req.params;
      const { name, tagColor } = req.body;
      const category = await Category.findById(categoryId);
      if (!category)
        return sendErrorResponse(res, 404, "Category do not exist.");

      category.name = name === "" ? category.name : name;
      category.tagColor = tagColor === "" ? category.tagColor : tagColor;

      const updated_category = await category.save();
      return sendSuccessResponse(res, 200, {
        category: updated_category,
      });
    } catch (error) {
      console.log(error);
      return sendErrorResponse(res, 500, "Server error occurred.");
    }
  },
  deleteCategory: async (req, res) => {
    try {
      const { categoryId } = req.params;
      const category = await Category.findById(categoryId);
      if (!category) return;

      const related_todos = await Todo.find({ categoryId });
      if (related_todos.length > 0)
        return sendErrorResponse(
          res,
          400,
          "Have related todos existed! Cannot delete category."
        );
      const delete_category = await category.deleteOne({ _id: categoryId });
      return sendSuccessResponse(res, 200, {
        message: "Category deleted successed.",
        category: delete_category,
      });
    } catch (error) {
      console.log(error);
      return sendErrorResponse(res, 500, "Server error occurred.");
    }
  },
};

module.exports = categoryControllers;
