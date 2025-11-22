const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
  saveInspectionDetails,
  getInspectionDetails
} = require("../controllers/inspectionDetailController");

// Store photos
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Route
router.post(
  "/",
  upload.any(),   // handles photos
  saveInspectionDetails
);

router.get("/:inspection_id", getInspectionDetails);

module.exports = router;
