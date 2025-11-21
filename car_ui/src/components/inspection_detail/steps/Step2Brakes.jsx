import React, { useState } from "react";
import PremiumPhotoUploader from "../../PremiumPhotoUploader";
import { Disc, Gauge, Wrench } from "lucide-react";

export default function Step2Brakes({ data, setData, next, prev }) {
  const [errors, setErrors] = useState({});

  const requiredFields = [
    "brake_fl_pad_pct",
    "brake_fr_pad_pct",
    "brake_rl_pad_pct",
    "brake_rr_pad_pct",

    "brake_fl_disc_condition",
    "brake_fr_disc_condition",
    "brake_rl_disc_condition",
    "brake_rr_disc_condition",
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

  const set = (key, val) => {
    setData((prev) => ({ ...prev, [key]: val }));
  };

  return (
    <div>
      {/* SECTION HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <Wrench className="w-7 h-7 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">Brakes Inspection</h2>
      </div>

      {/* CARD 1 — BRAKE PAD WEAR (%) */}
      <div className="p-5 rounded-3xl border bg-white shadow-sm mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Gauge className="w-6 h-6 text-blue-500" />
          <h3 className="font-medium text-gray-900">Brake Pad Wear (%)</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            ["brake_fl_pad_pct", "Front Left (FL) Pad %"],
            ["brake_fr_pad_pct", "Front Right (FR) Pad %"],
            ["brake_rl_pad_pct", "Rear Left (RL) Pad %"],
            ["brake_rr_pad_pct", "Rear Right (RR) Pad %"],
          ].map(([key, label]) => (
            <div key={key}>
              <label className="text-sm">{label}</label>
              <input
                type="number"
                value={data[key] || ""}
                onChange={(e) => set(key, Number(e.target.value))}
                className="w-full border rounded px-2 py-1"
              />
              {errors[key] && (
                <p className="text-red-500 text-xs">{errors[key]}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CARD 2 — DISC CONDITION */}
      <div className="p-5 rounded-3xl border bg-white shadow-sm mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Disc className="w-6 h-6 text-blue-500" />
          <h3 className="font-medium text-gray-900">Disc Condition</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            ["brake_fl_disc_condition", "FL Disc Condition"],
            ["brake_fr_disc_condition", "FR Disc Condition"],
            ["brake_rl_disc_condition", "RL Disc Condition"],
            ["brake_rr_disc_condition", "RR Disc Condition"],
          ].map(([key, label]) => (
            <div key={key}>
              <label className="text-sm">{label}</label>
              <input
                type="text"
                value={data[key] || ""}
                onChange={(e) => set(key, e.target.value)}
                className="w-full border rounded px-2 py-1"
              />
              {errors[key] && (
                <p className="text-red-500 text-xs">{errors[key]}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CARD 3 — PHOTOS */}
      <PremiumPhotoUploader
        label="Brake Photos"
        files={data.photos_brake || []}
        onChange={(files) =>
          setData((prev) => ({ ...prev, photos_brake: files }))
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
