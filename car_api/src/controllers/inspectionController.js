const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

const createInspection = async (req, res) => {
  try {
    const formData = req.body;
    const photos = req.files;

    const photoNames = photos ? photos.map(file => file.filename) : [];

    const id = uuidv4();

    const query = `
      INSERT INTO inspections (id, brand, model, year, mileage, vin, plate, accident_history, service_records,
        body_condition, dents, scratches, repainted_areas, rust,
        paint_type, paint_condition, fading, clear_coat_peeling,
        front_bumper, rear_bumper, hood, trunk, roof, left_fender, right_fender,
        left_front_door, left_rear_door, right_front_door, right_rear_door,
        engine_starts, engine_noise, exhaust_smoke, oil_leaks, overheating,
        windshield, rear_glass, side_glass, sunroof,
        ac_cooling, ac_heating, blower_speed, ac_smell,
        coolant_level, engine_oil, brake_fluid, power_steering, battery,
        brake_pads, brake_discs, hand_brake, abs_light,
        headlights, taillights, indicators, wipers,
        central_lock, power_windows, infotainment, reverse_camera,
        photos)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      id,
      formData.brand || null, formData.model || null, formData.year || null,
      formData.mileage || null, formData.vin || null, formData.plate || null,
      formData.accident_history || null, formData.service_records || null,
      formData.body_condition || null, formData.dents || null, formData.scratches || null,
      formData.repainted_areas || null, formData.rust || null,
      formData.paint_type || null, formData.paint_condition || null, formData.fading || null,
      formData.clear_coat_peeling || null,
      formData.front_bumper || null, formData.rear_bumper || null, formData.hood || null,
      formData.trunk || null, formData.roof || null, formData.left_fender || null,
      formData.right_fender || null, formData.left_front_door || null, formData.left_rear_door || null,
      formData.right_front_door || null, formData.right_rear_door || null,
      formData.engine_starts || null, formData.engine_noise || null, formData.exhaust_smoke || null,
      formData.oil_leaks || null, formData.overheating || null,
      formData.windshield || null, formData.rear_glass || null, formData.side_glass || null,
      formData.sunroof || null,
      formData.ac_cooling || null, formData.ac_heating || null, formData.blower_speed || null,
      formData.ac_smell || null,
      formData.coolant_level || null, formData.engine_oil || null, formData.brake_fluid || null,
      formData.power_steering || null, formData.battery || null,
      formData.brake_pads || null, formData.brake_discs || null, formData.hand_brake || null,
      formData.abs_light || null,
      formData.headlights || null, formData.taillights || null, formData.indicators || null,
      formData.wipers || null,
      formData.central_lock || null, formData.power_windows || null, formData.infotainment || null,
      formData.reverse_camera || null,
      JSON.stringify(photoNames)
    ];

    await pool.execute(query, values);

    res.json({ success: true, id });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { createInspection };