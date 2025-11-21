import React from "react";
import { Camera, Upload } from "lucide-react";

export default function PremiumPhotoUploader({ label, files, onChange, error }) {
  const handleSelect = (e) => {
    const selected = Array.from(e.target.files);
    onChange(selected);
  };

  const removeImage = (idx) => {
    const filtered = files.filter((_, i) => i !== idx);
    onChange(filtered);
  };

  return (
    <div className="mt-6">
      {/* MAIN CONTAINER */}
      <div
        className={`p-6 rounded-3xl border-4 border-dashed transition 
          ${
            error
              ? "border-red-500 bg-red-50"
              : "border-blue-300 bg-blue-50"
          }`}
      >
        {/* LABEL + ICON */}
        <h3 className="flex items-center gap-3 text-lg font-semibold text-gray-900 mb-4">
          <Camera className="w-8 h-8 text-blue-600" />
          {label}
        </h3>

        {error && (
          <p className="text-red-600 text-sm mb-2">
            {error}
          </p>
        )}

        {/* UPLOAD BUTTON */}
        <div className="text-center">
          <Upload className="w-14 h-14 text-blue-600 mx-auto mb-4" />

          <label className="cursor-pointer inline-block">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleSelect}
              className="hidden"
            />

            <div className="px-5 py-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm shadow-md hover:shadow-lg transition">
              Select Photos
            </div>
          </label>
        </div>

        {/* PREVIEW GRID */}
        {files.length > 0 && (
          <div className="mt-5 grid grid-cols-3 md:grid-cols-5 gap-3">
            {files.map((file, index) => {
              const imgURL = URL.createObjectURL(file);

              return (
                <div
                  key={index}
                  className="relative w-full h-24 rounded-xl overflow-hidden shadow border-4 border-white"
                >
                  <img
                    src={imgURL}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />

                  {/* DELETE BUTTON */}
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-white/90 hover:bg-white text-red-600 text-xs px-2 rounded-full shadow"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
