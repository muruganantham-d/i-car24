import React, { useState } from "react";
import { FileText, ClipboardList, UserCheck } from "lucide-react";

export default function Step10NotesVerification({ data, setData, prev, submit }) {
  const [errors, setErrors] = useState({});

  const fields = [
    "roadworthy_notes",
    "previous_accident_notes",
    "additional_notes",
    "odo_verified",
    "owner_reference",
  ];

  const validate = () => {
    let e = {};

    fields.forEach((f) => {
      if (!data[f] && data[f] !== 0) e[f] = "Required";
    });

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const set = (key, val) => setData((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = () => {
    if (validate()) submit(); // parent handleSubmit()
  };

  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <ClipboardList className="w-7 h-7 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">
          Final Notes & Verification
        </h2>
      </div>

      {/* CARD 1 — NOTES */}
      <div className="p-6 bg-white rounded-3xl border shadow-sm mb-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-6 h-6 text-blue-500" />
          <h3 className="font-medium text-gray-900">Inspection Notes</h3>
        </div>

        {/* Roadworthiness Notes */}
        <div className="mb-4">
          <label className="text-sm">Roadworthy Notes</label>
          <textarea
            rows={3}
            value={data.roadworthy_notes || ""}
            onChange={(e) => set("roadworthy_notes", e.target.value)}
            className="w-full border rounded px-3 py-2"
          ></textarea>
          {errors.roadworthy_notes && (
            <p className="text-red-500 text-xs">{errors.roadworthy_notes}</p>
          )}
        </div>

        {/* Accident Notes */}
        <div className="mb-4">
          <label className="text-sm">Previous Accident Notes</label>
          <textarea
            rows={3}
            value={data.previous_accident_notes || ""}
            onChange={(e) => set("previous_accident_notes", e.target.value)}
            className="w-full border rounded px-3 py-2"
          ></textarea>
          {errors.previous_accident_notes && (
            <p className="text-red-500 text-xs">
              {errors.previous_accident_notes}
            </p>
          )}
        </div>

        {/* Additional Notes */}
        <div>
          <label className="text-sm">Additional Notes</label>
          <textarea
            rows={3}
            value={data.additional_notes || ""}
            onChange={(e) => set("additional_notes", e.target.value)}
            className="w-full border rounded px-3 py-2"
          ></textarea>
          {errors.additional_notes && (
            <p className="text-red-500 text-xs">
              {errors.additional_notes}
            </p>
          )}
        </div>
      </div>

      {/* CARD 2 — VERIFICATION */}
      <div className="p-6 bg-white rounded-3xl border shadow-sm mb-6">
        <div className="flex items-center gap-2 mb-4">
          <UserCheck className="w-6 h-6 text-blue-500" />
          <h3 className="font-medium text-gray-900">Verification</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Odometer Verified */}
          <div>
            <label className="text-sm">Odometer Verified?</label>
            <select
              value={data.odo_verified ?? ""}
              onChange={(e) => set("odo_verified", Number(e.target.value))}
              className="w-full border rounded px-2 py-1"
            >
              <option value="">Select</option>
              <option value={1}>Yes</option>
              <option value={0}>No</option>
            </select>
            {errors.odo_verified && (
              <p className="text-red-500 text-xs">{errors.odo_verified}</p>
            )}
          </div>

          {/* Owner Reference */}
          <div>
            <label className="text-sm">Owner Reference</label>
            <input
              type="text"
              value={data.owner_reference || ""}
              onChange={(e) => set("owner_reference", e.target.value)}
              className="w-full border rounded px-2 py-1"
              placeholder="Inspector reference or owner remarks"
            />
            {errors.owner_reference && (
              <p className="text-red-500 text-xs">
                {errors.owner_reference}
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
          onClick={handleSubmit}
          className="px-6 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Submit Inspection ✔
        </button>
      </div>
    </div>
  );
}
