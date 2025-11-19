// src/components/InspectionList.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Car, Calendar, Eye, Download, Clock } from "lucide-react";
import toast from "react-hot-toast";

export default function InspectionList() {
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    fetchInspections();
  }, []);

  const fetchInspections = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/inspections");
      console.log("Data received:", res.data); // ← SEE THIS IN CONSOLE!
      setInspections(res.data);
    } catch (err) {
      toast.error("Failed to load reports");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const viewReport = (inspection) => {
    setSelected(inspection);
    setShowDetail(true);
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

        {/* CARD GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {inspections.map((item) => (
            <div
              key={item.id}
              onClick={() => viewReport(item)}
              className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer border border-gray-200 overflow-hidden"
            >
              {/* PHOTOS - NO JSON.parse! */}
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
                <h3 className="text-2xl font-bold text-gray-900">
                  {item.brand} {item.model}
                </h3>
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

        {/* MODAL - NO JSON.parse HERE EITHER! */}
        {showDetail && selected && (
          <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4" onClick={() => setShowDetail(false)}>
            <div className="bg-white rounded-3xl max-w-6xl w-full max-h-screen overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="sticky top-0 bg-white border-b-2 p-6 flex justify-between items-center">
                <h2 className="text-4xl font-bold text-gray-900">
                  {selected.brand} {selected.model} {selected.year}
                </h2>
                <button onClick={() => setShowDetail(false)} className="text-4xl font-light text-gray-500 hover:text-gray-800">
                  ×
                </button>
              </div>

              <div className="p-8 space-y-12">
                {/* PHOTOS IN MODAL */}
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

                {/* ALL DETAILS */}
                <div>
                  <h3 className="text-3xl font-bold mb-6">Complete Inspection Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {Object.entries(selected).map(([key, value]) => {
                      if (["id", "photos", "created_at"].includes(key)) return null;
                      if (!value) value = "—";
                      const label = key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
                      return (
                        <div key={key} className="bg-gray-50 rounded-2xl p-6 border">
                          <p className="text-sm font-semibold text-gray-600">{label}</p>
                          <p className="text-xl font-bold text-gray-900 mt-2">{value}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="text-center pt-8">
                  <button
                    onClick={() => window.print()}
                    className="bg-green-600 hover:bg-green-700 text-white px-12 py-5 rounded-full text-xl font-bold shadow-xl flex items-center gap-4 mx-auto"
                  >
                    <Download className="w-8 h-8" /> Print Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}