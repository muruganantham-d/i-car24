const pool = require("../config/db");
const path = require("path");

/**
 * Create new inspection
 */
exports.createInspection = async (req, res) => {
  try {
    // photos uploaded → req.files
    const photos = req.files || [];

    const photoPaths = photos.map((file) => {
      return `/uploads/${file.filename}`;
    });

    const {
      client_name,
      client_phone,
      inspector_name,
      vehicle_make,
      vehicle_model,
      vehicle_year,
      vin,
      plate_number,
      mileage,
      fuel_type,
      seating_capacity,
      color,
      test_drive,
      car_registered_in,
      overall_condition,
      remarks
    } = req.body;

    const sql = `
      INSERT INTO inspections 
      (
        client_name, client_phone, inspector_name,
        vehicle_make, vehicle_model, vehicle_year,
        vin, plate_number, mileage, fuel_type,
        seating_capacity, color, test_drive,
        car_registered_in, overall_condition, remarks,
        photos_json
      )
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `;

    const values = [
      client_name,
      client_phone,
      inspector_name,
      vehicle_make,
      vehicle_model,
      vehicle_year,
      vin || null,
      plate_number || null,
      mileage || null,
      fuel_type || null,
      seating_capacity || null,
      color || null,
      test_drive ? 1 : 0,
      car_registered_in || null,
      overall_condition || null,
      remarks || null,
      JSON.stringify(photoPaths)
    ];

    const [result] = await pool.query(sql, values);

    return res.json({
      id: result.insertId,
      pdfUrl: `/api/inspections/pdf/${result.insertId}`,
      shareUrl: `http://localhost:5173/report/${result.insertId}`,
      message: "Inspection created successfully"
    });
  } catch (err) {
    console.error("Error creating inspection:", err);
    return res.status(500).json({ error: "Server error. Try again." });
  }
};

/**
 * Fetch single inspection by ID
 */
exports.getInspection = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      "SELECT * FROM inspections WHERE id = ? LIMIT 1",
      [id]
    );

    if (rows.length === 0)
      return res.status(404).json({ error: "Inspection not found" });

    return res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching inspection:", err);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * List all inspections
 */
exports.getAllInspections = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, client_name, vehicle_make, vehicle_model, vehicle_year, created_at FROM inspections ORDER BY id DESC"
    );
    return res.json(rows);
  } catch (err) {
    console.error("Error listing inspections:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
