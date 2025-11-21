import React, { useState } from "react";
import PremiumPhotoUploader from "../../PremiumPhotoUploader";
import {
  Armchair,
  LayoutDashboard,
  ThermometerSnowflake,
  Fan,
  Gauge,
  Brush,
  KeySquare,
} from "lucide-react";

export default function Step5Interior({ data, setData, next, prev }) {
  const [errors, setErrors] = useState({});

  const requiredFields = [
    "seat_condition_front",
    "seat_condition_rear",
    "dashboard_condition",
    "steering_condition",
    "gear_shift_condition",
    "odometer_working",
    "ac_cooling",
    "ac_airflow",
    "roofliner_condition",
    "interior_odour",
  ];

  const validate = () => {
    let e = {};
    requiredFields.forEach((f) => {
      if (!data[f] || data[f] === "") e[f] = "Required";
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validate()) next();
  };

  const set = (key, value) =>
    setData((prev) => ({ ...prev, [key]: value }));

  return (
    <div>
      {/* STEP HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <Armchair className="w-7 h-7 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">
          Interior Inspection
        </h2>
      </div>

      {/* CARD 1 — SEATS */}
      <div className="p-5 rounded-3xl border bg-white shadow-sm mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Armchair className="w-6 h-6 text-blue-500" />
          <h3 className="font-medium text-gray-900">Seats Condition</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>
            <label className="text-sm">Front Seats Condition</label>
            <input
              type="text"
              value={data.seat_condition_front || ""}
              onChange={(e) => set("seat_condition_front", e.target.value)}
              className="w-full border rounded px-2 py-1"
            />
            {errors.seat_condition_front && (
              <p className="text-red-500 text-xs">
                {errors.seat_condition_front}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm">Rear Seats Condition</label>
            <input
              type="text"
              value={data.seat_condition_rear || ""}
              onChange={(e) => set("seat_condition_rear", e.target.value)}
              className="w-full border rounded px-2 py-1"
            />
            {errors.seat_condition_rear && (
              <p className="text-red-500 text-xs">
                {errors.seat_condition_rear}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* CARD 2 — DASHBOARD & CONTROLS */}
      <div className="p-5 rounded-3xl border bg-white shadow-sm mb-6">
        <div className="flex items-center gap-2 mb-4">
          <LayoutDashboard className="w-6 h-6 text-blue-500" />
          <h3 className="font-medium text-gray-900">
            Dashboard & Controls
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Dashboard */}
          <div>
            <label className="text-sm">Dashboard Condition</label>
            <input
              type="text"
              value={data.dashboard_condition || ""}
              onChange={(e) => set("dashboard_condition", e.target.value)}
              className="w-full border rounded px-2 py-1"
            />
            {errors.dashboard_condition && (
              <p className="text-red-500 text-xs">
                {errors.dashboard_condition}
              </p>
            )}
          </div>

          {/* Steering */}
          <div>
            <label className="text-sm">Steering Condition</label>
            <input
              type="text"
              value={data.steering_condition || ""}
              onChange={(e) => set("steering_condition", e.target.value)}
              className="w-full border rounded px-2 py-1"
            />
            {errors.steering_condition && (
              <p className="text-red-500 text-xs">
                {errors.steering_condition}
              </p>
            )}
          </div>

          {/* Gear Shift */}
          <div>
            <label className="text-sm">Gear Shift Condition</label>
            <input
              type="text"
              value={data.gear_shift_condition || ""}
              onChange={(e) => set("gear_shift_condition", e.target.value)}
              className="w-full border rounded px-2 py-1"
            />
            {errors.gear_shift_condition && (
              <p className="text-red-500 text-xs">
                {errors.gear_shift_condition}
              </p>
            )}
          </div>

          {/* Odometer */}
          <div>
            <label className="text-sm">Odometer Working</label>
            <select
              value={data.odometer_working || ""}
              onChange={(e) => set("odometer_working", e.target.value)}
              className="w-full border rounded px-2 py-1"
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
              <option value="Intermittent">Intermittent</option>
            </select>
            {errors.odometer_working && (
              <p className="text-red-500 text-xs">
                {errors.odometer_working}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* CARD 3 — AC SYSTEM */}
      <div className="p-5 rounded-3xl border bg-white shadow-sm mb-6">
        <div className="flex items-center gap-2 mb-4">
          <ThermometerSnowflake className="w-6 h-6 text-blue-500" />
          <h3 className="font-medium text-gray-900">AC System</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* AC Cooling */}
          <div>
            <label className="text-sm">AC Cooling</label>
            <input
              type="text"
              value={data.ac_cooling || ""}
              onChange={(e) => set("ac_cooling", e.target.value)}
              className="w-full border rounded px-2 py-1"
            />
            {errors.ac_cooling && (
              <p className="text-red-500 text-xs">{errors.ac_cooling}</p>
            )}
          </div>

          {/* AC Airflow */}
          <div>
            <label className="text-sm">AC Airflow</label>
            <input
              type="text"
              value={data.ac_airflow || ""}
              onChange={(e) => set("ac_airflow", e.target.value)}
              className="w-full border rounded px-2 py-1"
            />
            {errors.ac_airflow && (
              <p className="text-red-500 text-xs">{errors.ac_airflow}</p>
            )}
          </div>

          {/* Roofliner */}
          <div>
            <label className="text-sm">Roofliner Condition</label>
            <input
              type="text"
              value={data.roofliner_condition || ""}
              onChange={(e) => set("roofliner_condition", e.target.value)}
              className="w-full border rounded px-2 py-1"
            />
            {errors.roofliner_condition && (
              <p className="text-red-500 text-xs">
                {errors.roofliner_condition}
              </p>
            )}
          </div>

          {/* Interior Smell */}
          <div>
            <label className="text-sm">Interior Odour</label>
            <input
              type="text"
              value={data.interior_odour || ""}
              onChange={(e) => set("interior_odour", e.target.value)}
              className="w-full border rounded px-2 py-1"
            />
            {errors.interior_odour && (
              <p className="text-red-500 text-xs">
                {errors.interior_odour}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* CARD 4 — INTERIOR PHOTOS */}
      <PremiumPhotoUploader
        label="Interior Photos"
        files={data.photos_interior || []}
        onChange={(files) =>
          setData((prev) => ({ ...prev, photos_interior: files }))
        }
      />

      {/* BUTTONS */}
      <div className="flex justify-between mt-8">
        <button
          onClick={prev}
          className="px-6 py-2 rounded bg-gray-200 hover:bg-gray-300"
        >
          ← Back
        </button>

        <button
          onClick={handleNext}
          className="px-6 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
