import React, { useState } from "react";
import PremiumPhotoUploader from "../../PremiumPhotoUploader";
import {
  Droplets,
  FlaskRound,
  Wrench,
  BookCheck,
  Calendar,
} from "lucide-react";

export default function Step8FluidsMaintenance({ data, setData, next, prev }) {
  const [errors, setErrors] = useState({});

  const fields = [
    "brake_fluid_level",
    "transmission_fluid_level",
    "power_steering_fluid",
    "washer_fluid",
    "coolant_type",
    "last_oil_change_km",
    "service_book_present",
    "service_last_date",
  ];

  const validate = () => {
    let e = {};

    fields.forEach((f) => {
      if (!data[f] && data[f] !== 0) e[f] = "Required";
    });

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const set = (key, value) =>
    setData((prev) => ({ ...prev, [key]: value }));

  const handleNext = () => {
    if (validate()) next();
  };

  return (
    <div>
      {/* SECTION HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <Droplets className="w-7 h-7 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">
          Fluids & Maintenance
        </h2>
      </div>

      {/* CARD: FLUID LEVELS */}
      <div className="p-6 rounded-3xl bg-white border shadow-sm mb-6">
        <div className="flex items-center gap-2 mb-4">
          <FlaskRound className="w-6 h-6 text-blue-500" />
          <h3 className="font-medium text-gray-900">
            Fluid Levels
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            ["brake_fluid_level", "Brake Fluid Level"],
            ["transmission_fluid_level", "Transmission Fluid Level"],
            ["power_steering_fluid", "Power Steering Fluid"],
            ["washer_fluid", "Windshield Washer Fluid"],
            ["coolant_type", "Coolant Type"],
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
                <p className="text-red-500 text-xs">
                  {errors[key]}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CARD: MAINTENANCE */}
      <div className="p-6 rounded-3xl bg-white border shadow-sm mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Wrench className="w-6 h-6 text-blue-500" />
          <h3 className="font-medium text-gray-900">
            Maintenance Details
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Last oil change */}
          <div>
            <label className="text-sm">Last Oil Change (KM)</label>
            <input
              type="number"
              value={data.last_oil_change_km || ""}
              onChange={(e) =>
                set("last_oil_change_km", Number(e.target.value))
              }
              className="w-full border rounded px-2 py-1"
            />
            {errors.last_oil_change_km && (
              <p className="text-red-500 text-xs">
                {errors.last_oil_change_km}
              </p>
            )}
          </div>

          {/* Service Book */}
          <div>
            <label className="text-sm">Service Book Present</label>
            <select
              value={data.service_book_present || ""}
              onChange={(e) =>
                set("service_book_present", Number(e.target.value))
              }
              className="w-full border rounded px-2 py-1"
            >
              <option value="">Select</option>
              <option value={1}>Yes</option>
              <option value={0}>No</option>
            </select>

            {errors.service_book_present && (
              <p className="text-red-500 text-xs">
                {errors.service_book_present}
              </p>
            )}
          </div>

          {/* Service last date */}
          <div className="md:col-span-2">
            <label className="text-sm">Service Last Date</label>
            <input
              type="date"
              value={data.service_last_date || ""}
              onChange={(e) => set("service_last_date", e.target.value)}
              className="w-full border rounded px-2 py-1"
            />
            {errors.service_last_date && (
              <p className="text-red-500 text-xs">
                {errors.service_last_date}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* PHOTOS */}
      <PremiumPhotoUploader
        label="Fluids & Maintenance Photos"
        files={data.photos_fluids || []}
        onChange={(files) =>
          setData((prev) => ({ ...prev, photos_fluids: files }))
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
