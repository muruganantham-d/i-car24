const express = require("express");
const router = express.Router();

const upload = require("../middleware/multerConfig");
const {
  createInspection,
  getInspection,
  getAllInspections,
} = require("../controllers/inspectionController");

// Create inspection (with photos)
router.post("/", upload, createInspection);

// Get all
router.get("/", getAllInspections);

// Get single
router.get("/:id", getInspection);

module.exports = router;
