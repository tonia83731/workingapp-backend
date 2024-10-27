const express = require("express");
const router = express.Router();
const bucketControllers = require("../../controllers/bucket-controllers");

router.get("/:bucketId", bucketControllers.getBucket);
router.put("/:bucketId", bucketControllers.editBucket);
router.delete("/:bucketId", bucketControllers.deleteBucket);
router.get("/:workspaceId/all", bucketControllers.getBucketsByWorkspace);
router.post("/", bucketControllers.createBucket);

module.exports = router;
