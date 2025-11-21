import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Car,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import DownloadPDFButton from "../components/pdf_comp/DownloadPDFButton";

export default function ReportPage() {
  const { id } = useParams(); // Get ID from URL
  const [inspection, setInspection] = useState(null);
  const [selectedWithImages, setSelectedWithImages] = useState(null);
  const [openSections, setOpenSections] = useState({});
       const navigate = useNavigate();
  const goToInspections = () => {
  navigate("/inspections");
};
const [lightboxOpen, setLightboxOpen] = useState(false);
const [currentIndex, setCurrentIndex] = useState(0);

  const formatField = (field) =>
    field.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  // ------------------ Fetch inspection by ID ------------------
  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/inspections/${id}`);
        setInspection(res.data);
      } catch (err) {
        toast.error("Failed to load inspection");
        console.error(err);
      }
    };

    load();
  }, [id]);

  // ------------------ Load images with base64 for PDF ------------------
  useEffect(() => {
    if (!inspection || !inspection.photos) return;

    const loadImages = async () => {
      try {
        const photosWithBase64 = await Promise.all(
          inspection.photos.map(async (photoName) => {
            try {
              const res = await fetch(`http://localhost:4000/uploads/${photoName}`);
              const blob = await res.blob();
              const mimeType = blob.type || "image/jpeg";

              const reader = new FileReader();
              reader.readAsDataURL(blob);
              await new Promise((resolve, reject) => {
                reader.onload = () => resolve();
                reader.onerror = reject;
              });

              return {
                name: photoName,
                base64: reader.result.split(",")[1],
                mimeType,
              };
            } catch {
              return { name: photoName, base64: null, mimeType: "image/jpeg" };
            }
          })
        );

        setSelectedWithImages({ ...inspection, photos: photosWithBase64 });
      } catch (err) {
        toast.error("Image prepare failed");
      }
    };

    loadImages();
  }, [inspection]);

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  if (!inspection) {
    return (
      <div className="min-h-screen flex items-center justify-center text-3xl font-bold">
        Loading report...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-3xl p-10">

        {/* HEADER */}
        <div className="flex items-center justify-between border-b pb-6">
          <div>
            <h1 className="text-4xl font-bold">
              {inspection.year} {inspection.brand} {inspection.model}
            </h1>
            <p className="text-lg text-gray-600 mt-2">
              Plate: {inspection.plate || "—"} • {inspection.mileage} KM
            </p>
          </div>



<button onClick={goToInspections} className="px-4 py-2 bg-blue-600 text-white rounded">
All Inspec (Admin)
</button>
{/* </div> */}        </div>

        {/* ----------------- PHOTOS ----------------- */}
    <div className="mt-10">
  <h2 className="text-3xl font-bold mb-6">Vehicle Photos</h2>

  {/* Only show first 3, and overlay "+X more" on the 3rd if more exist */}
  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
    {inspection.photos.slice(0, 4).map((photo, index) => {
      const remaining = inspection.photos.length - 4;
      const isLastInPreview = index === 3 && remaining > 0;

      return (
        <div
          key={index}
          className="relative cursor-pointer group overflow-hidden rounded-2xl shadow-lg"
          onClick={() => setLightboxOpen(true)} // Open lightbox
        >
          <img
            src={`http://localhost:4000/uploads/${photo}`}
            alt={`Vehicle ${index + 1}`}
            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
          />

          {/* Overlay "+X more" on 3rd image if more photos exist */}
          {isLastInPreview && (
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
              <p className="text-white text-3xl font-bold">
                +{remaining} more
              </p>
            </div>
          )}
        </div>
      );
    })}

    {/* If less than 3 photos, fill empty slots */}
    {inspection.photos.length < 4 &&
      Array(4 - inspection.photos.length)
        .fill(null)
        .map((_, i) => (
          <div key={`empty-${i}`} className="bg-gray-200 border-2 border-dashed rounded-2xl h-64" />
        ))}
  </div>
</div>

{/* ----------------- LIGHTBOX MODAL ----------------- */}
{lightboxOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center">
    <div className="relative max-w-4xl w-full mx-4">
      {/* Close Button */}
      <button
        onClick={() => setLightboxOpen(false)}
        className="absolute -top-12 right-0 text-white text-4xl hover:text-gray-300"
      >
        ×
      </button>

      {/* Current Image */}
      <img
        src={`http://localhost:4000/uploads/${inspection.photos[currentIndex]}`}
        alt="Full view"
        className="w-full h-auto max-h-screen object-contain"
      />

      {/* Navigation Arrows */}
      {inspection.photos.length > 1 && (
        <>
          <button
            onClick={() =>
              setCurrentIndex((prev) => (prev - 1 + inspection.photos.length) % inspection.photos.length)
            }
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-5xl bg-black bg-opacity-50 rounded-full w-12 h-12 flex items-center justify-center hover:bg-opacity-75"
          >
            ‹
          </button>
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % inspection.photos.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-5xl bg-black bg-opacity-50 rounded-full w-12 h-12 flex items-center justify-center hover:bg-opacity-75"
          >
            ›
          </button>
        </>
      )}

      {/* Image Counter */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-lg bg-black bg-opacity-60 px-4 py-2 rounded">
        {currentIndex + 1} / {inspection.photos.length}
      </div>
    </div>
  </div>
)}

        {/* ----------------- DETAILS ----------------- */}
<div className="mt-12">
  <h2 className="text-2xl font-bold mb-6 text-gray-800">Car Details</h2>

  {/* Two Tables Side by Side */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    
    {/* LEFT TABLE - First 4 rows */}
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <table className="w-full">
        <tbody>
          {[
            ["Make", inspection.brand],
            ["Model", inspection.model],
            ["Year", inspection.year],
            ["Mileage", inspection.mileage + " KM"],
          ].map(([label, val], index) => (
            <tr
              key={label}
              className={`${
                index === 0 ? "border-t" : "border-b"
              } border-gray-200 hover:bg-gray-50/50`}
            >
              {/* Left Column - Light Background */}
              <td className="px-5 py-3.5 text-sm font-medium text-gray-700 bg-[#f2f4f5] border-r border-gray-200">
                {label}
              </td>
              {/* Right Column */}
              <td className="px-5 py-3.5 text-sm font-semibold text-gray-900 text-right">
                {val || "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* RIGHT TABLE - Last 4 rows */}
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <table className="w-full">
        <tbody>
          {[
            ["Plate", inspection.plate],
            ["VIN", inspection.vin],
            ["Accident History", inspection.accident_history],
            ["Service Records", inspection.service_records],
          ].map(([label, val], index) => (
            <tr
              key={label}
              className={`${
                index === 0 ? "border-t" : "border-b"
              } border-gray-200 hover:bg-gray-50/50`}
            >
              {/* Left Column - Same Light Background */}
              <td className="px-5 py-3.5 text-sm font-medium text-gray-700 bg-[#f2f4f5] border-r border-gray-200">
                {label}
              </td>
              {/* Right Column */}
              <td className="px-5 py-3.5 text-sm font-semibold text-gray-900 text-right">
                {val || "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</div>

        {/* ----------------- ACCORDION SECTIONS ----------------- */}
        <div className="mt-12 space-y-6">

          {/* Body Section */}
          <div className="bg-gray-100 rounded-xl border">
            <button
              onClick={() => toggleSection("body")}
              className="w-full p-5 text-left text-xl font-bold flex justify-between"
            >
              Body & Paint Condition
              {openSections.body ? <ChevronUp /> : <ChevronDown />}
            </button>

            {openSections.body && (
              <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  "body_condition",
                  "dents",
                  "scratches",
                  "repainted_areas",
                  "rust",
                  "paint_type",
                  "paint_condition",
                ].map((field) => (
                  <div key={field} className="bg-white rounded-lg p-4 shadow">
                    <p className="text-sm text-gray-600">{formatField(field)}</p>
                    <p className="text-lg font-bold">{inspection[field] || "—"}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ADD MORE SECTIONS EXACTLY LIKE ABOVE … */}
        </div>

        {/* ----------------- DOWNLOAD BUTTON ----------------- */}
        <div className="mt-16 text-center">
          <DownloadPDFButton
            data={selectedWithImages}
            fileName={`${inspection.brand} ${inspection.model} Report.pdf`}
          />
        </div>
      </div>
    </div>
  );
}
