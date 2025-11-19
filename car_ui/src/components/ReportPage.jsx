import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function ReportPage() {
  const { id } = useParams();
  const data = useLocation().state;
  const navigate = useNavigate();
  const goToInspections = () => {
  navigate("/inspections");
};

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1>Inspection Submitted</h1>
      <div className="flex justify-end">
<button onClick={goToInspections} className="px-4 py-2 bg-blue-600 text-white rounded">
  Go to Inspections
</button>
</div>
      <p className="text-gray-600 mt-2">Report ID: {id}</p>

      <div className="mt-6 p-5 border rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-4">PDF Report</h2>

        {data?.pdfUrl ? (
          <>
            <a
              href={data.pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="bg-green-600 text-white px-6 py-3 rounded-xl shadow"
            >
              Download PDF
            </a>

            <p className="mt-4 text-sm">
              <strong>Share Link:</strong>
              <br />
              <code className="bg-gray-100 p-2 rounded block mt-2">
                {data.shareUrl}
              </code>
            </p>
          </>
        ) : (
          <p>PDF is generating... refresh in a moment.</p>
        )}
      </div>
    </div>
  );
}
