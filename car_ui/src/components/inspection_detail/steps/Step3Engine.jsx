import React, { useState } from "react";
import PremiumPhotoUploader from "../../PremiumPhotoUploader";
import {
  Cog,
  Waves,
  Flame,
  Droplet,
  Cable,
  Battery,
  Settings2,
} from "lucide-react";

export default function Step3Engine({ data, setData, next, prev }) {
  const [errors, setErrors] = useState({});

  const requiredFields = [
    "engine_noise",
    "engine_vibration",
    "engine_oil_level",
    "engine_oil_leak",
    "coolant_level",
    "coolant_leak",
    "exhaust_smoke",
    "belt_condition",
    "engine_mounts_condition",
    "battery_status",
    "battery_voltage",
    "transmission_condition",
  ];

  const validate = () => {
    let e = {};

    requiredFields.forEach((f) => {
      if (!data[f] && data[f] !== 0) e[f] = "Required";
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
        <Cog className="w-7 h-7 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">
          Engine & Transmission
        </h2>
      </div>

      {/* CARD 1 — ENGINE HEALTH */}
      <div className="p-5 rounded-3xl border bg-white shadow-sm mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Flame className="w-6 h-6 text-blue-500" />
          <h3 className="font-medium text-gray-900">Engine Health</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* ENGINE NOISE */}
          <div>
            <label className="text-sm">Engine Noise</label>
            <input
              type="text"
              value={data.engine_noise || ""}
              onChange={(e) => set("engine_noise", e.target.value)}
              className="w-full border rounded px-2 py-1"
            />
            {errors.engine_noise && (
              <p className="text-red-500 text-xs">{errors.engine_noise}</p>
            )}
          </div>

          {/* ENGINE VIBRATION */}
          <div>
            <label className="text-sm">Engine Vibration</label>
            <input
              type="text"
              value={data.engine_vibration || ""}
              onChange={(e) => set("engine_vibration", e.target.value)}
              className="w-full border rounded px-2 py-1"
            />
            {errors.engine_vibration && (
              <p className="text-red-500 text-xs">{errors.engine_vibration}</p>
            )}
          </div>

          {/* EXHAUST SMOKE */}
          <div>
            <label className="text-sm">Exhaust Smoke</label>
            <input
              type="text"
              value={data.exhaust_smoke || ""}
              onChange={(e) => set("exhaust_smoke", e.target.value)}
              className="w-full border rounded px-2 py-1"
            />
            {errors.exhaust_smoke && (
              <p className="text-red-500 text-xs">{errors.exhaust_smoke}</p>
            )}
          </div>

          {/* BELT CONDITION */}
          <div>
            <label className="text-sm">Belt Condition</label>
            <input
              type="text"
              value={data.belt_condition || ""}
              onChange={(e) => set("belt_condition", e.target.value)}
              className="w-full border rounded px-2 py-1"
            />
            {errors.belt_condition && (
              <p className="text-red-500 text-xs">{errors.belt_condition}</p>
            )}
          </div>

          {/* ENGINE MOUNTS */}
          <div>
            <label className="text-sm">Engine Mounts Condition</label>
            <input
              type="text"
              value={data.engine_mounts_condition || ""}
              onChange={(e) =>
                set("engine_mounts_condition", e.target.value)
              }
              className="w-full border rounded px-2 py-1"
            />
            {errors.engine_mounts_condition && (
              <p className="text-red-500 text-xs">
                {errors.engine_mounts_condition}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* CARD 2 — FLUIDS */}
      <div className="p-5 rounded-3xl border bg-white shadow-sm mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Droplet className="w-6 h-6 text-blue-500" />
          <h3 className="font-medium text-gray-900">Fluids & Leak Check</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* OIL LEVEL */}
          <div>
            <label className="text-sm">Engine Oil Level</label>
            <input
              type="text"
              value={data.engine_oil_level || ""}
              onChange={(e) => set("engine_oil_level", e.target.value)}
              className="w-full border rounded px-2 py-1"
            />
            {errors.engine_oil_level && (
              <p className="text-red-500 text-xs">{errors.engine_oil_level}</p>
            )}
          </div>

          {/* OIL LEAK */}
          <div>
            <label className="text-sm">Engine Oil Leak</label>
            <select
              value={data.engine_oil_leak || ""}
              onChange={(e) => set("engine_oil_leak", e.target.value)}
              className="w-full border rounded px-2 py-1"
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
              <option value="Minor Leak">Minor Leak</option>
            </select>
            {errors.engine_oil_leak && (
              <p className="text-red-500 text-xs">{errors.engine_oil_leak}</p>
            )}
          </div>

          {/* COOLANT LEVEL */}
          <div>
            <label className="text-sm">Coolant Level</label>
            <input
              type="text"
              value={data.coolant_level || ""}
              onChange={(e) => set("coolant_level", e.target.value)}
              className="w-full border rounded px-2 py-1"
            />
            {errors.coolant_level && (
              <p className="text-red-500 text-xs">{errors.coolant_level}</p>
            )}
          </div>

          {/* COOLANT LEAK */}
          <div>
            <label className="text-sm">Coolant Leak</label>
            <select
              value={data.coolant_leak || ""}
              onChange={(e) => set("coolant_leak", e.target.value)}
              className="w-full border rounded px-2 py-1"
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
              <option value="Minor Leak">Minor Leak</option>
            </select>
            {errors.coolant_leak && (
              <p className="text-red-500 text-xs">{errors.coolant_leak}</p>
            )}
          </div>
        </div>
      </div>

      {/* CARD 3 — BATTERY & TRANSMISSION */}
      <div className="p-5 rounded-3xl border bg-white shadow-sm mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Settings2 className="w-6 h-6 text-blue-500" />
          <h3 className="font-medium text-gray-900">
            Battery & Transmission
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* BATTERY STATUS */}
          <div>
            <label className="text-sm">Battery Status</label>
            <input
              type="text"
              value={data.battery_status || ""}
              onChange={(e) => set("battery_status", e.target.value)}
              className="w-full border rounded px-2 py-1"
            />
            {errors.battery_status && (
              <p className="text-red-500 text-xs">{errors.battery_status}</p>
            )}
          </div>

          {/* BATTERY VOLTAGE */}
          <div>
            <label className="text-sm">Battery Voltage</label>
            <input
              type="number"
              step="0.01"
              value={data.battery_voltage || ""}
              onChange={(e) => set("battery_voltage", e.target.value)}
              className="w-full border rounded px-2 py-1"
            />
            {errors.battery_voltage && (
              <p className="text-red-500 text-xs">{errors.battery_voltage}</p>
            )}
          </div>

          {/* TRANSMISSION CONDITION */}
          <div>
            <label className="text-sm">Transmission Condition</label>
            <input
              type="text"
              value={data.transmission_condition || ""}
              onChange={(e) => set("transmission_condition", e.target.value)}
              className="w-full border rounded px-2 py-1"
            />
            {errors.transmission_condition && (
              <p className="text-red-500 text-xs">
                {errors.transmission_condition}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* CARD 4 — ENGINE PHOTOS */}
      <PremiumPhotoUploader
        label="Engine Photos"
        files={data.photos_engine || []}
        onChange={(files) =>
          setData((prev) => ({ ...prev, photos_engine: files }))
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
