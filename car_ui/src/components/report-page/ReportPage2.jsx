import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Car, FileText, Image as ImageIcon } from "lucide-react";
import { useParams } from "react-router-dom";

export default function ReportPage2() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [inspection, setInspection] = useState(null);
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const base = "http://localhost:4000";

        const res1 = await fetch(`${base}/api/inspections/${id}`);
        const res2 = await fetch(`${base}/api/inspection-details/${id}`);

        const data1 = await res1.json();
        const data2 = await res2.json();

        setInspection(data1);
        setDetail(data2);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) return (
    <div className="w-full h-screen flex items-center justify-center">
      <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
    </div>
  );

  if (!inspection || !detail) return (
    <div className="p-6 text-center text-red-600 text-xl">No Report Found</div>
  );

  const detailData = JSON.parse(detail.data_json || "{}");
  const photos = JSON.parse(detail.photos_json || "{}");

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Car className="text-blue-600" /> Inspection Report
          </h1>
          <Button className="bg-blue-600 hover:bg-blue-700">Download PDF</Button>
        </div>

        {/* Vehicle Details */}
        <Card className="shadow-md border rounded-2xl">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><FileText className="text-blue-600"/> Vehicle Information</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div><strong>Make:</strong> {inspection.vehicle_make}</div>
              <div><strong>Model:</strong> {inspection.vehicle_model}</div>
              <div><strong>Year:</strong> {inspection.vehicle_year}</div>
              <div><strong>Color:</strong> {inspection.color}</div>
              <div><strong>Fuel:</strong> {inspection.fuel_type}</div>
              <div><strong>Mileage:</strong> {inspection.mileage}</div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Sections */}
        <Card className="shadow-md border rounded-2xl">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2"><FileText className="text-blue-600"/> Inspection Summary</h2>

            {Object.entries(detailData).map(([key, value]) => {
              if (key === "photos_json") return null;
              return (
                <div key={key} className="grid grid-cols-2 border-b py-2">
                  <div className="font-medium text-gray-600 capitalize">{key.replace(/_/g, " ")}</div>
                  <div className="text-gray-900">{String(value)}</div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Photos */}
        {Object.entries(photos).map(([section, files]) => (
          <Card key={section} className="shadow-md border rounded-2xl">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <ImageIcon className="text-blue-600" /> {section.replace("photos_", "").toUpperCase()} Photos
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {files.map((img, idx) => (
                  <img key={idx} src={`http://localhost:4000/uploads/${img}`} alt="" className="w-full h-32 object-cover rounded-xl shadow" />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

      </div>
    </div>
  );
}
