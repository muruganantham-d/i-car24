import React, { useState } from "react";
import PremiumPhotoUploader from "../../PremiumPhotoUploader";
import { Zap, Headphones, Sliders, Wifi } from "lucide-react";

/**
 * Step6Electrical
 * props:
 * - data: global form state
 * - setData: setter for global form state
 * - next: move to next step
 * - prev: move to previous step
 */
export default function Step6Electrical({ data, setData, next, prev }) {
  const [errors, setErrors] = useState({});

  const requiredFields = [
    "headlights_status",
    "tail_lights_status",
    "indicators_status",
    "horn_status",
    "power_windows_status",
    "central_locking_status",
    "wipers_status",
    "infotainment_status",
  ];

  const validate = () => {
    const e = {};
    requiredFields.forEach((f) => {
      if (!data[f] && data[f] !== 0) e[f] = "Required";
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validate()) next();
  };

  const set = (key, val) => setData((prev) => ({ ...prev, [key]: val }));

  return (
    <div>
      {/* STEP HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <Zap className="w-7 h-7 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">Electrical & Lights</h2>
      </div>

      {/* CARD 1 — LIGHTS */}
      <div className="p-5 rounded-3xl border bg-white shadow-sm mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Headphones className="w-6 h-6 text-blue-500" />
          <h3 className="font-medium text-gray-900">Lights & Signals</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            ["headlights_status", "Headlights Status"],
            ["tail_lights_status", "Tail Lights Status"],
            ["indicators_status", "Indicators Status"],
            ["wipers_status", "Wipers Status"],
          ].map(([key, label]) => (
            <div key={key}>
              <label className="text-sm">{label}</label>
              <select
                value={data[key] || ""}
                onChange={(e) => set(key, e.target.value)}
                className="w-full border rounded px-2 py-1"
              >
                <option value="">Select</option>
                <option value="Working">Working</option>
                <option value="Faulty">Faulty</option>
                <option value="Intermittent">Intermittent</option>
              </select>
              {errors[key] && <p className="text-red-500 text-xs">{errors[key]}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* CARD 2 — ALARMS & CONTROLS */}
      <div className="p-5 rounded-3xl border bg-white shadow-sm mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Sliders className="w-6 h-6 text-blue-500" />
          <h3 className="font-medium text-gray-900">Controls & Alerts</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm">Horn Status</label>
            <select
              value={data.horn_status || ""}
              onChange={(e) => set("horn_status", e.target.value)}
              className="w-full border rounded px-2 py-1"
            >
              <option value="">Select</option>
              <option value="Working">Working</option>
              <option value="Weak">Weak</option>
              <option value="Not Working">Not Working</option>
            </select>
            {errors.horn_status && <p className="text-red-500 text-xs">{errors.horn_status}</p>}
          </div>

          <div>
            <label className="text-sm">Power Windows Status</label>
            <select
              value={data.power_windows_status || ""}
              onChange={(e) => set("power_windows_status", e.target.value)}
              className="w-full border rounded px-2 py-1"
            >
              <option value="">Select</option>
              <option value="Working">Working</option>
              <option value="Stuck">Stuck</option>
              <option value="Partial">Partial</option>
            </select>
            {errors.power_windows_status && <p className="text-red-500 text-xs">{errors.power_windows_status}</p>}
          </div>

          <div>
            <label className="text-sm">Central Locking</label>
            <select
              value={data.central_locking_status || ""}
              onChange={(e) => set("central_locking_status", e.target.value)}
              className="w-full border rounded px-2 py-1"
            >
              <option value="">Select</option>
              <option value="Working">Working</option>
              <option value="Faulty">Faulty</option>
            </select>
            {errors.central_locking_status && <p className="text-red-500 text-xs">{errors.central_locking_status}</p>}
          </div>

          <div>
            <label className="text-sm">Infotainment Status</label>
            <select
              value={data.infotainment_status || ""}
              onChange={(e) => set("infotainment_status", e.target.value)}
              className="w-full border rounded px-2 py-1"
            >
              <option value="">Select</option>
              <option value="Working">Working</option>
              <option value="Faulty">Faulty</option>
              <option value="Partial">Partial</option>
            </select>
            {errors.infotainment_status && <p className="text-red-500 text-xs">{errors.infotainment_status}</p>}
          </div>
        </div>
      </div>

      {/* CARD 3 — PHOTOS */}
      <PremiumPhotoUploader
        label="Electrical Photos"
        files={data.photos_electrical || []}
        onChange={(files) => setData((prev) => ({ ...prev, photos_electrical: files }))}
      />

      {/* NAV BUTTONS */}
      <div className="flex justify-between mt-8">
        <button onClick={prev} className="px-6 py-2 rounded bg-gray-200 hover:bg-gray-300">
          ← Back
        </button>

        <button onClick={handleNext} className="px-6 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
          Next →
        </button>
      </div>
    </div>
  );
}
