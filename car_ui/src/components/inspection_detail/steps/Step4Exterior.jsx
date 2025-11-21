import React, { useState } from "react";
import PremiumPhotoUploader from "../../PremiumPhotoUploader";
import {
  Car,
  Sparkles,
  Shield,
  PanelTopOpen,
  PanelsTopLeft,
} from "lucide-react";

export default function Step4Exterior({ data, setData, next, prev }) {
  const [errors, setErrors] = useState({});

  const requiredFields = [
    "front_bumper",
    "rear_bumper",
    "left_fender",
    "right_fender",
    "left_front_door",
    "left_rear_door",
    "right_front_door",
    "right_rear_door",
    "bonnet",
    "roof",
    "trunk",
    "paint_consistency",
    "windshield_condition",
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
        <Car className="w-7 h-7 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">
          Exterior Inspection
        </h2>
      </div>

      {/* CARD 1 — BUMPERS */}
      <div className="p-5 rounded-3xl border bg-white shadow-sm mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-6 h-6 text-blue-500" />
          <h3 className="font-medium text-gray-900">Bumpers</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            ["front_bumper", "Front Bumper"],
            ["rear_bumper", "Rear Bumper"],
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

      {/* CARD 2 — FENDERS */}
      <div className="p-5 rounded-3xl border bg-white shadow-sm mb-6">
        <div className="flex items-center gap-2 mb-4">
          <PanelsTopLeft className="w-6 h-6 text-blue-500" />
          <h3 className="font-medium text-gray-900">Fenders</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            ["left_fender", "Left Fender"],
            ["right_fender", "Right Fender"],
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

      {/* CARD 3 — DOORS */}
      <div className="p-5 rounded-3xl border bg-white shadow-sm mb-6">
        <div className="flex items-center gap-2 mb-4">
          <PanelTopOpen className="w-6 h-6 text-blue-500" />
          <h3 className="font-medium text-gray-900">Doors</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {[
            ["left_front_door", "Left Front Door"],
            ["left_rear_door", "Left Rear Door"],
            ["right_front_door", "Right Front Door"],
            ["right_rear_door", "Right Rear Door"],
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

      {/* CARD 4 — PANELS */}
      <div className="p-5 rounded-3xl border bg-white shadow-sm mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-6 h-6 text-blue-500" />
          <h3 className="font-medium text-gray-900">Panels & Body</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {[
            ["bonnet", "Bonnet"],
            ["roof", "Roof"],
            ["trunk", "Trunk"],
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

        {/* Paint */}
        <div className="mt-4">
          <label className="text-sm">Paint Consistency</label>
          <input
            type="text"
            value={data.paint_consistency || ""}
            onChange={(e) => set("paint_consistency", e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
          {errors.paint_consistency && (
            <p className="text-red-500 text-xs">
              {errors.paint_consistency}
            </p>
          )}
        </div>

        {/* Windshield */}
        <div className="mt-4">
          <label className="text-sm">Windshield Condition</label>
          <input
            type="text"
            value={data.windshield_condition || ""}
            onChange={(e) => set("windshield_condition", e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
          {errors.windshield_condition && (
            <p className="text-red-500 text-xs">
              {errors.windshield_condition}
            </p>
          )}
        </div>

      </div>

      {/* CARD 5 — PHOTOS */}
      <PremiumPhotoUploader
        label="Exterior Photos"
        files={data.photos_exterior || []}
        onChange={(files) =>
          setData((prev) => ({ ...prev, photos_exterior: files }))
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
