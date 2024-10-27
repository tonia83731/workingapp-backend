const express = require("express");
const router = express.Router();

const workspaceController = require("../../controllers/workspace-controller");

router.get("/:workspaceId", workspaceController.getWorkspace);
// error
router.get("/user/:userId", workspaceController.getWorkspacesByUser);
router.post("/", workspaceController.createWorkspace);
router.post("/permission", workspaceController.checkedWorkspacePermission);
router.put("/add-user", workspaceController.addUserToWorkspace);
router.put("/remove-user", workspaceController.removeUserFromWorkspace);

module.exports = router;
