const db = require("../config/db");
const fs = require("fs");

exports.saveInspectionDetails = async (req, res) => {
  try {
    const {
      inspection_id
    } = req.body;

    // 1. Validate FK exists
    const [exists] = await db.query(
      "SELECT id FROM inspections WHERE id = ?",
      [inspection_id]
    );

    if (exists.length === 0) {
      return res.status(400).json({ message: "Invalid inspection_id" });
    }

    // 2. Parse all scalar fields (non-photo fields)
    const detailData = {};
    for (const key in req.body) {
      if (!key.startsWith("photos_") && key !== "inspection_id") {
        detailData[key] = req.body[key];
      }
    }

    // 3. Handle photos
    const photoFiles = req.files || [];
    const groupedPhotos = {};

    photoFiles.forEach((file) => {
      const fieldName = file.fieldname.replace("[]", "");
      if (!groupedPhotos[fieldName]) groupedPhotos[fieldName] = [];
      groupedPhotos[fieldName].push(file.filename);
    });

    // add photos_json
    detailData.photos_json = JSON.stringify(groupedPhotos);

    // 4. Insert into inspection_details table
    await db.query(
      "INSERT INTO inspection_details (inspection_id, data_json, photos_json) VALUES (?, ?, ?)",
      [
        inspection_id,
        JSON.stringify(detailData),
        detailData.photos_json
      ]
    );

    return res.json({ message: "Inspection details saved" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};





exports.getInspectionDetails = async (req, res) => {
  try {
    const { inspection_id } = req.params;

    const [rows] = await db.query(
      "SELECT * FROM inspection_details WHERE inspection_id = ? LIMIT 1",
      [inspection_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "No inspection details found" });
    }

    return res.json(rows[0]);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
