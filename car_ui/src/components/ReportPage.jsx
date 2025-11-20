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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {inspection.photos.map((photo, index) => (
              <a
                key={index}
                href={`http://localhost:4000/uploads/${photo}`}
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src={`http://localhost:4000/uploads/${photo}`}
                  className="w-full h-64 object-cover rounded-2xl shadow-lg hover:scale-105 duration-200"
                  alt=""
                />
              </a>
            ))}
          </div>
        </div>

        {/* ----------------- DETAILS ----------------- */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold mb-6">Car Details</h2>

          <table className="w-full border rounded-xl overflow-hidden">
            <tbody>
              {[
                ["Make", inspection.brand],
                ["Model", inspection.model],
                ["Year", inspection.year],
                ["Mileage", inspection.mileage + " KM"],
                ["Plate", inspection.plate],
                ["VIN", inspection.vin],
                ["Accident History", inspection.accident_history],
                ["Service Records", inspection.service_records],
              ].map(([label, val]) => (
                <tr key={label} className="border-b">
                  <td className="p-4 font-medium">{label}</td>
                  <td className="p-4 font-bold">{val || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
