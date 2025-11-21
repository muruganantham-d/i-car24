import React, { useState } from "react";
import PremiumPhotoUploader from "../../PremiumPhotoUploader";
import {
  Car,
  Waves,
  Stamp,
  Flame,
  MountainSnow,
  Wrench
} from "lucide-react";

export default function Step7Underbody({ data, setData, next, prev }) {
  const [errors, setErrors] = useState({});

  const requiredFields = [
    "suspension_noise",
    "shock_absorber_condition",
    "bush_condition",
    "chassis_rust",
    "oil_leak_underbody",
    "exhaust_condition",
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
        <MountainSnow className="w-7 h-7 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">
          Suspension & Underbody
        </h2>
      </div>

      {/* CARD 1 — SUSPENSION NOISE */}
      <div className="p-5 rounded-3xl border bg-white shadow-sm mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Wrench className="w-6 h-6 text-blue-500" />
          <h3 className="font-medium text-gray-900">Suspension Noise</h3>
        </div>

        <div>
          <label className="text-sm">Suspension Noise</label>
          <input
            type="text"
            value={data.suspension_noise || ""}
            onChange={(e) => set("suspension_noise", e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
          {errors.suspension_noise && (
            <p className="text-red-500 text-xs">{errors.suspension_noise}</p>
          )}
        </div>
      </div>

      {/* CARD 2 — SHOCK ABSORBERS */}
      <div className="p-5 rounded-3xl border bg-white shadow-sm mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Waves className="w-6 h-6 text-blue-500" />
          <h3 className="font-medium text-gray-900">Shock Absorbers</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm">Shock Absorber Condition</label>
            <input
              type="text"
              value={data.shock_absorber_condition || ""}
              onChange={(e) => set("shock_absorber_condition", e.target.value)}
              className="w-full border rounded px-2 py-1"
            />
            {errors.shock_absorber_condition && (
              <p className="text-red-500 text-xs">
                {errors.shock_absorber_condition}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm">Bush Condition</label>
            <input
              type="text"
              value={data.bush_condition || ""}
              onChange={(e) => set("bush_condition", e.target.value)}
              className="w-full border rounded px-2 py-1"
            />
            {errors.bush_condition && (
              <p className="text-red-500 text-xs">{errors.bush_condition}</p>
            )}
          </div>
        </div>
      </div>

      {/* CARD 3 — CHASSIS / UNDERBODY STATE */}
      <div className="p-5 rounded-3xl border bg-white shadow-sm mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Stamp className="w-6 h-6 text-blue-500" />
          <h3 className="font-medium text-gray-900">Chassis & Underbody</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm">Chassis Rust</label>
            <input
              type="text"
              value={data.chassis_rust || ""}
              onChange={(e) => set("chassis_rust", e.target.value)}
              className="w-full border rounded px-2 py-1"
            />
            {errors.chassis_rust && (
              <p className="text-red-500 text-xs">{errors.chassis_rust}</p>
            )}
          </div>

          <div>
            <label className="text-sm">Oil Leak Underbody</label>
            <select
              value={data.oil_leak_underbody || ""}
              onChange={(e) => set("oil_leak_underbody", e.target.value)}
              className="w-full border rounded px-2 py-1"
            >
              <option value="">Select</option>
              <option value="No Leak">No Leak</option>
              <option value="Minor Leak">Minor Leak</option>
              <option value="Leak Present">Leak Present</option>
            </select>
            {errors.oil_leak_underbody && (
              <p className="text-red-500 text-xs">
                {errors.oil_leak_underbody}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm">Exhaust Condition</label>
            <input
              type="text"
              value={data.exhaust_condition || ""}
              onChange={(e) => set("exhaust_condition", e.target.value)}
              className="w-full border rounded px-2 py-1"
            />
            {errors.exhaust_condition && (
              <p className="text-red-500 text-xs">{errors.exhaust_condition}</p>
            )}
          </div>
        </div>
      </div>

      {/* CARD 4 — UNDERBODY PHOTOS */}
      <PremiumPhotoUploader
        label="Underbody Photos"
        files={data.photos_undercarriage || []}
        onChange={(files) =>
          setData((prev) => ({ ...prev, photos_undercarriage: files }))
        }
      />

      {/* NAV BUTTONS */}
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
