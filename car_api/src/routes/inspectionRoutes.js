// src/routes/inspectionRoutes.js

const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { createInspection } = require('../controllers/inspectionController');
const upload = require('../middleware/multerConfig');

router.post('/', upload, createInspection);

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT id, brand, model, year, mileage, plate, photos, created_at 
      FROM inspections 
      ORDER BY created_at DESC
    `);

    const inspections = rows.map(row => {
      let photosArray = [];

      if (row.photos && typeof row.photos === 'string') {
        try {
          const parsed = JSON.parse(row.photos);
          photosArray = Array.isArray(parsed) ? parsed : [];
        } catch (e) {
          photosArray = [];
        }
      }

      return {
        ...row,
        photos: photosArray
      };
    });

    res.json(inspections);
  } catch (err) {
    console.error("GET error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;