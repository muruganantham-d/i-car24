// src/components/InspectionList.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { Car, Calendar, Eye, Download, ChevronDown, ChevronUp } from "lucide-react";
import toast from "react-hot-toast";
import DownloadPDFButton from "./pdf_comp/DownloadPDFButton";





// Main Component
export default function InspectionList() {
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [openSections, setOpenSections] = useState({});
  const [selectedWithImages, setSelectedWithImages] = useState(null); // For PDF data

  // NEW: Define formatField here for use in modal and PDF
  const formatField = (field) =>
    field.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  useEffect(() => {
    fetchInspections();
  }, []);

  // UPDATED: Image loading with MIME detection (unchanged)
  useEffect(() => {
    if (selected && selected.photos && selected.photos.length > 0) {
      const loadImages = async () => {
        try {
          const photosWithBase64 = await Promise.all(
            selected.photos.map(async (photoName) => { // photo is string filename
              try {
                const res = await fetch(`http://localhost:4000/uploads/${photoName}`);
                if (!res.ok) throw new Error("Fetch failed");
                const blob = await res.blob();
                const mimeType = blob.type || "image/jpeg"; // Detect type
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                await new Promise((resolve, reject) => {
                  reader.onload = () => resolve();
                  reader.onerror = reject;
                });
                const base64 = reader.result.split(",")[1]; // Extract base64
                return { name: photoName, base64, mimeType };
              } catch (err) {
                console.error(`Image load failed for ${photoName}:`, err);
                return { name: photoName, base64: null, mimeType: "image/jpeg" };
              }
            })
          );
          setSelectedWithImages({ ...selected, photos: photosWithBase64 });
        } catch (err) {
          toast.error("Failed to prepare images for PDF");
          setSelectedWithImages(selected); // Fallback without images
        }
      };
      loadImages();
    } else {
      setSelectedWithImages(selected);
    }
  }, [selected]);

  const fetchInspections = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/inspections");
      console.log("Data received:", res.data);
      setInspections(res.data);
    } catch (err) {
      toast.error("Failed to load reports");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const viewReport = async (inspection) => {
    try {
      const res = await axios.get(`http://localhost:4000/api/inspections/${inspection.id}`);
      setSelected(res.data);
      setOpenSections({}); // Reset accordions
      setShowDetail(true);
    } catch (err) {
      toast.error("Failed to load report details");
    }
  };

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // REMOVED DUPLICATE: Keep only this internal version
  const calculatePercentage = (fields) => {
    if (!selected) return 0;
    const goodCount = fields.filter(
      (field) => selected[field] && selected[field].toLowerCase().includes("good")
    ).length;
    return Math.round((goodCount / fields.length) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-2xl font-bold text-blue-600">Loading Reports...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-4">
            <Car className="w-14 h-14 text-blue-600" />
            All Vehicle Inspection Reports
          </h1>
          <p className="text-xl text-gray-600">Total Reports: {inspections.length}</p>
        </div>

        {/* CARD GRID - Unchanged */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {inspections.map((item) => (
            <div
              key={item.id}
              onClick={() => viewReport(item)}
              className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer border border-gray-200 overflow-hidden"
            >
              {item.photos && item.photos.length > 0 ? (
                <div className="grid grid-cols-3 gap-1 p-3 bg-gray-100">
                  {item.photos.slice(0, 3).map((photo, i) => (
                    <img
                      key={i}
                      src={`http://localhost:4000/uploads/${photo}`}
                      alt={`Photo ${i + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-gray-200 h-32 flex items-center justify-center">
                  <Car className="w-16 h-16 text-gray-400" />
                </div>
              )}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900">{item.brand} {item.model}</h3>
                <p className="text-lg text-gray-600">{item.year} • {item.mileage} km</p>
                <p className="text-sm text-gray-500 mt-2">Plate: {item.plate || "—"}</p>
                <div className="flex items-center gap-4 mt-4 text-sm">
                  <span className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-5 h-5" />
                    {new Date(item.created_at).toLocaleDateString("en-GB")}
                  </span>
                </div>
                <button className="mt-6 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 flex items-center justify-center gap-3 shadow-lg">
                  <Eye className="w-6 h-6" /> View Full Report
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* MODAL - Updated accordions to use formatField */}
        {showDetail && selected && (
          <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4" onClick={() => setShowDetail(false)}>
            <div className="bg-white rounded-3xl max-w-6xl w-full max-h-screen overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="bg-white border-b-2 p-6 flex justify-between items-center">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">
                    {selected.year} - {selected.brand} {selected.model}
                  </h1>
                  <p className="text-lg text-gray-600 mt-1">Plate: {selected.plate || "—"} | Mileage: {selected.mileage || "—"} km</p>
                </div>
                <button onClick={() => setShowDetail(false)} className="text-4xl font-light text-gray-500 hover:text-gray-800">
                  ×
                </button>
              </div>

              <div className="p-8 space-y-12">
                {/* PHOTOS, CAR DETAILS, SUMMARY - Unchanged */}
                {selected.photos && selected.photos.length > 0 && (
                  <div>
                    <h3 className="text-3xl font-bold mb-6">Vehicle Photos</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {selected.photos.map((photo, i) => (
                        <a key={i} href={`http://localhost:4000/uploads/${photo}`} target="_blank" className="block">
                          <img
                            src={`http://localhost:4000/uploads/${photo}`}
                            alt={`Photo ${i + 1}`}
                            className="w-full h-64 object-cover rounded-2xl shadow-xl hover:scale-105 transition"
                          />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-3xl font-bold mb-6">Car Details</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-300 rounded-2xl shadow-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-lg font-bold text-gray-900">Detail</th>
                          <th className="px-6 py-4 text-left text-lg font-bold text-gray-900">Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { label: "Make", value: selected.brand },
                          { label: "Model", value: selected.model },
                          { label: "Year", value: selected.year },
                          { label: "Mileage (KM)", value: selected.mileage },
                          { label: "Plate Number", value: selected.plate },
                          { label: "VIN", value: selected.vin },
                          { label: "Accident History", value: selected.accident_history },
                          { label: "Service Records", value: selected.service_records },
                        ].map(({ label, value }) => (
                          <tr key={label} className="border-b border-gray-200">
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{label}</td>
                            <td className="px-6 py-4 text-sm font-bold text-gray-700">{value || "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h3 className="text-3xl font-bold mb-6">Summary</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="bg-blue-50 rounded-2xl p-6 text-center border-2 border-blue-200">
                      <p className="text-2xl font-bold text-blue-700">Exterior</p>
                      <p className="text-4xl font-bold text-blue-600">
                        {calculatePercentage(["body_condition", "front_bumper", "rear_bumper", "hood", "trunk", "roof"])}%
                      </p>
                    </div>
                    <div className="bg-green-50 rounded-2xl p-6 text-center border-2 border-green-200">
                      <p className="text-2xl font-bold text-green-700">Engine</p>
                      <p className="text-4xl font-bold text-green-600">
                        {calculatePercentage(["engine_starts", "engine_noise", "oil_leaks", "coolant_level", "engine_oil"])}%
                      </p>
                    </div>
                    <div className="bg-yellow-50 rounded-2xl p-6 text-center border-2 border-yellow-200">
                      <p className="text-2xl font-bold text-yellow-700">Brakes</p>
                      <p className="text-4xl font-bold text-yellow-600">
                        {calculatePercentage(["brake_pads", "brake_discs", "hand_brake"])}%
                      </p>
                    </div>
                    <div className="bg-purple-50 rounded-2xl p-6 text-center border-2 border-purple-200">
                      <p className="text-2xl font-bold text-purple-700">Electrical</p>
                      <p className="text-4xl font-bold text-purple-600">
                        {calculatePercentage(["headlights", "taillights", "central_lock", "power_windows"])}%
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-3xl font-bold mb-6">Detailed Inspection</h3>
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-2xl border border-gray-200">
                      <button
                        onClick={() => toggleSection("body")}
                        className="w-full text-left p-6 font-bold text-lg flex justify-between items-center"
                      >
                        Body & Paint Condition
                        <span className="ml-4">
                          {openSections.body ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                        </span>
                      </button>
                      {openSections.body && (
                        <div className="p-6 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                          {["body_condition", "dents", "scratches", "repainted_areas", "rust", "paint_type", "paint_condition", "fading", "clear_coat_peeling"].map((field) => (
                            <div key={field} className="bg-white rounded-xl p-4 shadow-sm">
                              <p className="text-sm font-medium text-gray-600">{formatField(field)}</p>
                              <p className="text-lg font-bold text-gray-900 mt-1">{selected[field] || "—"}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="bg-gray-50 rounded-2xl border border-gray-200">
                      <button
                        onClick={() => toggleSection("exterior")}
                        className="w-full text-left p-6 font-bold text-lg flex justify-between items-center"
                      >
                        Exterior Components
                        <span className="ml-4">
                          {openSections.exterior ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                        </span>
                      </button>
                      {openSections.exterior && (
                        <div className="p-6 border-t border-gray-200 grid grid-cols-2 md:grid-cols-3 gap-4">
                          {Object.keys(selected).filter((k) =>
                            ["bumper", "door", "hood", "trunk", "roof", "fender"].some((p) => k.includes(p))
                          ).map((field) => (
                            <div key={field} className="bg-white rounded-xl p-4 shadow-sm">
                              <p className="text-sm font-medium text-gray-600">{formatField(field)}</p>
                              <p className="text-lg font-bold text-gray-900 mt-1">{selected[field] || "—"}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="bg-gray-50 rounded-2xl border border-gray-200">
                      <button
                        onClick={() => toggleSection("engine")}
                        className="w-full text-left p-6 font-bold text-lg flex justify-between items-center"
                      >
                        Engine & Mechanical
                        <span className="ml-4">
                          {openSections.engine ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                        </span>
                      </button>
                      {openSections.engine && (
                        <div className="p-6 border-t border-gray-200 grid grid-cols-2 md:grid-cols-3 gap-4">
                          {["engine_starts", "engine_noise", "exhaust_smoke", "oil_leaks", "overheating", "coolant_level", "engine_oil", "brake_fluid", "power_steering", "battery", "brake_pads", "brake_discs", "hand_brake", "abs_light"].map((field) => (
                            <div key={field} className="bg-white rounded-xl p-4 shadow-sm">
                              <p className="text-sm font-medium text-gray-600">{formatField(field)}</p>
                              <p className="text-lg font-bold text-gray-900 mt-1">{selected[field] || "—"}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="bg-gray-50 rounded-2xl border border-gray-200">
                      <button
                        onClick={() => toggleSection("electrical")}
                        className="w-full text-left p-6 font-bold text-lg flex justify-between items-center"
                      >
                        AC & Electrical
                        <span className="ml-4">
                          {openSections.electrical ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                        </span>
                      </button>
                      {openSections.electrical && (
                        <div className="p-6 border-t border-gray-200 grid grid-cols-2 md:grid-cols-3 gap-4">
                          {["ac_cooling", "ac_heating", "blower_speed", "ac_smell", "headlights", "taillights", "indicators", "wipers", "central_lock", "power_windows", "infotainment", "reverse_camera"].map((field) => (
                            <div key={field} className="bg-white rounded-xl p-4 shadow-sm">
                              <p className="text-sm font-medium text-gray-600">{formatField(field)}</p>
                              <p className="text-lg font-bold text-gray-900 mt-1">{selected[field] || "—"}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="bg-gray-50 rounded-2xl border border-gray-200">
                      <button
                        onClick={() => toggleSection("glass")}
                        className="w-full text-left p-6 font-bold text-lg flex justify-between items-center"
                      >
                        Glass & Other
                        <span className="ml-4">
                          {openSections.glass ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                        </span>
                      </button>
                      {openSections.glass && (
                        <div className="p-6 border-t border-gray-200 grid grid-cols-2 md:grid-cols-3 gap-4">
                          {["windshield", "rear_glass", "side_glass", "sunroof"].map((field) => (
                            <div key={field} className="bg-white rounded-xl p-4 shadow-sm">
                              <p className="text-sm font-medium text-gray-600">{formatField(field)}</p>
                              <p className="text-lg font-bold text-gray-900 mt-1">{selected[field] || "—"}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* UPDATED: Download Button - Now fully functional */}
                <div className="text-center pt-8">
                  <DownloadPDFButton
                    data={selected}
                    fileName={`${selected?.brand || 'Vehicle'} ${selected?.model || ''} Report.pdf`}
                    onError={(err) => console.error('PDF Error:', err)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}