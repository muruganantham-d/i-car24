import React, { useState } from "react";
import {
  ShieldCheck,
  BadgeCheck,
  ShieldAlert,
  FileCheck,
  AlertTriangle,
} from "lucide-react";

export default function Step9SafetyLegal({ data, setData, next, prev }) {
  const [errors, setErrors] = useState({});

  const fields = [
    "airbags_status",
    "seatbelt_condition",
    "emission_test",
    "registration_valid",
    "insurance_valid",
  ];

  const validate = () => {
    let e = {};

    fields.forEach((f) => {
      if (!data[f] && data[f] !== 0) e[f] = "Required";
    });

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const set = (k, v) => setData((prev) => ({ ...prev, [k]: v }));

  const handleNext = () => {
    if (validate()) next();
  };

  return (
    <div>
      {/* SECTION HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <ShieldCheck className="w-7 h-7 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">
          Safety Systems & Legal Status
        </h2>
      </div>

      {/* CARD 1 – SAFETY SYSTEMS */}
      <div className="p-6 bg-white border rounded-3xl shadow-sm mb-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-6 h-6 text-blue-500" />
          <h3 className="font-medium text-gray-900">Safety Systems</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Airbags */}
          <div>
            <label className="text-sm">Airbags Status</label>
            <select
              value={data.airbags_status || ""}
              onChange={(e) => set("airbags_status", e.target.value)}
              className="w-full border rounded px-2 py-1"
            >
              <option value="">Select</option>
              <option value="Working">Working</option>
              <option value="Faulty">Faulty</option>
              <option value="Not Present">Not Present</option>
            </select>
            {errors.airbags_status && (
              <p className="text-red-500 text-xs">{errors.airbags_status}</p>
            )}
          </div>

          {/* Seatbelts */}
          <div>
            <label className="text-sm">Seatbelt Condition</label>
            <select
              value={data.seatbelt_condition || ""}
              onChange={(e) => set("seatbelt_condition", e.target.value)}
              className="w-full border rounded px-2 py-1"
            >
              <option value="">Select</option>
              <option value="Good">Good</option>
              <option value="Damaged">Damaged</option>
              <option value="Needs Replacement">Needs Replacement</option>
            </select>
            {errors.seatbelt_condition && (
              <p className="text-red-500 text-xs">{errors.seatbelt_condition}</p>
            )}
          </div>

          {/* Emission Test */}
          <div className="md:col-span-2">
            <label className="text-sm">Emission Test</label>
            <input
              type="text"
              value={data.emission_test || ""}
              onChange={(e) => set("emission_test", e.target.value)}
              className="w-full border rounded px-2 py-1"
              placeholder="e.g., Passed / Failed / NA"
            />
            {errors.emission_test && (
              <p className="text-red-500 text-xs">{errors.emission_test}</p>
            )}
          </div>
        </div>
      </div>

      {/* CARD 2 – LEGAL VALIDITY */}
      <div className="p-6 bg-white border rounded-3xl shadow-sm mb-6">
        <div className="flex items-center gap-2 mb-4">
          <FileCheck className="w-6 h-6 text-blue-500" />
          <h3 className="font-medium text-gray-900">Legal Validity</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Registration Valid */}
          <div>
            <label className="text-sm">Registration Valid</label>
            <select
              value={data.registration_valid ?? ""}
              onChange={(e) => set("registration_valid", Number(e.target.value))}
              className="w-full border rounded px-2 py-1"
            >
              <option value="">Select</option>
              <option value={1}>Valid</option>
              <option value={0}>Expired</option>
            </select>
            {errors.registration_valid && (
              <p className="text-red-500 text-xs">
                {errors.registration_valid}
              </p>
            )}
          </div>

          {/* Insurance Valid */}
          <div>
            <label className="text-sm">Insurance Valid</label>
            <select
              value={data.insurance_valid ?? ""}
              onChange={(e) => set("insurance_valid", Number(e.target.value))}
              className="w-full border rounded px-2 py-1"
            >
              <option value="">Select</option>
              <option value={1}>Valid</option>
              <option value={0}>Expired</option>
            </select>
            {errors.insurance_valid && (
              <p className="text-red-500 text-xs">
                {errors.insurance_valid}
              </p>
            )}
          </div>
        </div>
      </div>

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
