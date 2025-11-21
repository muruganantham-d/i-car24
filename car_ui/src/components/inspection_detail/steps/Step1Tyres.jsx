import React, { useState } from "react";
import PremiumPhotoUploader from "../../PremiumPhotoUploader";
import { Gauge, Disc, Info } from "lucide-react";

export default function Step1Tyres({ data, setData, next }) {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};

    const fields = [
      "tyre_fl_tread_pct",
      "tyre_fr_tread_pct",
      "tyre_rl_tread_pct",
      "tyre_rr_tread_pct",
      "tyre_fl_pressure_psi",
      "tyre_fr_pressure_psi",
      "tyre_rl_pressure_psi",
      "tyre_rr_pressure_psi",
      "tyre_spare_condition",
      "tyre_age_months",
    ];

    fields.forEach((f) => {
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

      {/* Section Title */}
      <div className="flex items-center gap-3 mb-6">
        <Disc className="w-7 h-7 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">Tyres & Wheels</h2>
      </div>

      {/* CARD 1 — Tread Depth */}
      <div className="p-5 rounded-3xl border bg-white shadow-sm mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Gauge className="w-6 h-6 text-blue-500" />
          <h3 className="font-medium text-gray-900">Tread Depth (%)</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            ["tyre_fl_tread_pct", "Front Left (FL)"],
            ["tyre_fr_tread_pct", "Front Right (FR)"],
            ["tyre_rl_tread_pct", "Rear Left (RL)"],
            ["tyre_rr_tread_pct", "Rear Right (RR)"],
          ].map(([key, label]) => (
            <div key={key}>
              <label className="text-sm">{label}</label>
              <input
                type="number"
                value={data[key] || ""}
                onChange={(e) => set(key, Number(e.target.value))}
                className="w-full border rounded px-2 py-1"
              />
              {errors[key] && <p className="text-red-500 text-xs">{errors[key]}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* CARD 2 — Air Pressure */}
      <div className="p-5 rounded-3xl border bg-white shadow-sm mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Gauge className="w-6 h-6 text-blue-500" />
          <h3 className="font-medium text-gray-900">Tyre Pressure (PSI)</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            ["tyre_fl_pressure_psi", "FL Pressure"],
            ["tyre_fr_pressure_psi", "FR Pressure"],
            ["tyre_rl_pressure_psi", "RL Pressure"],
            ["tyre_rr_pressure_psi", "RR Pressure"],
          ].map(([key, label]) => (
            <div key={key}>
              <label className="text-sm">{label}</label>
              <input
                type="number"
                value={data[key] || ""}
                onChange={(e) => set(key, Number(e.target.value))}
                className="w-full border rounded px-2 py-1"
              />
              {errors[key] && <p className="text-red-500 text-xs">{errors[key]}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* CARD 3 — Condition + Age */}
      <div className="p-5 rounded-3xl border bg-white shadow-sm mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Info className="w-6 h-6 text-blue-500" />
          <h3 className="font-medium text-gray-900">Additional Tyre Info</h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm">Spare Tyre Condition</label>
            <input
              type="text"
              value={data.tyre_spare_condition || ""}
              onChange={(e) => set("tyre_spare_condition", e.target.value)}
              className="w-full border rounded px-2 py-1"
            />
            {errors.tyre_spare_condition && (
              <p className="text-red-500 text-xs">{errors.tyre_spare_condition}</p>
            )}
          </div>

          <div>
            <label className="text-sm">Tyre Age (Months)</label>
            <input
              type="number"
              value={data.tyre_age_months || ""}
              onChange={(e) => set("tyre_age_months", Number(e.target.value))}
              className="w-full border rounded px-2 py-1"
            />
            {errors.tyre_age_months && (
              <p className="text-red-500 text-xs">{errors.tyre_age_months}</p>
            )}
          </div>
        </div>
      </div>

      {/* CARD 4 — Photos */}
      <PremiumPhotoUploader
        label="Tyre Photos"
        files={data.photos_tyre || []}
        onChange={(files) =>
          setData((prev) => ({ ...prev, photos_tyre: files }))
        }
      />

      {/* NEXT BUTTON */}
      <button
        onClick={handleNext}
        className="mt-6 bg-blue-600 text-white px-6 py-2 rounded"
      >
        Next →
      </button>
    </div>
  );
}
