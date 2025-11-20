// src/routes/inspectionRoutes.js

const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { createInspection } = require('../controllers/inspectionController');
const upload = require('../middleware/multerConfig');

// CREATE
router.post('/', upload, createInspection);

// LIST ALL
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT id, brand, model, year, mileage, plate, photos, created_at 
      FROM inspections 
      ORDER BY created_at DESC
    `);

    const result = rows.map(row => {
      let photos = [];
      if (row.photos) {
        if (typeof row.photos === 'string') {
          try { photos = JSON.parse(row.photos); } catch (e) { photos = []; }
        } else if (Array.isArray(row.photos)) {
          photos = row.photos;
        }
      }
      return { ...row, photos: Array.isArray(photos) ? photos : [] };
    });

    res.json(result);
  } catch (err) {
    console.error("GET all error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET ONE BY ID — 100% SAFE FOREVER
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM inspections WHERE id = ?', [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Not found" });
    }

    const data = rows[0];

    // SUPER SAFE PHOTOS HANDLING
    if (data.photos) {
      if (typeof data.photos === 'string') {
        try {
          data.photos = JSON.parse(data.photos);
        } catch (e) {
          console.warn("Corrupted photos JSON for ID:", req.params.id);
          data.photos = [];
        }
      }
      // If it's already array → keep it
      if (!Array.isArray(data.photos)) data.photos = [];
    } else {
      data.photos = [];
    }

    res.json(data);
  } catch (err) {
    console.error("CRITICAL ERROR in GET /:id →", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;