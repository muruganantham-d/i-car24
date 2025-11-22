// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import InspectionForm from "./components/InspecDetailForm";
import InspectionList from "./components/InspectionList";
import InspectionForm2 from "./components/inspection/InspectionsForm2";
import InspectionDetailPage from "./components/inspection_detail/InspectionDetailForm";
import ReportPage2 from "./components/report-page/ReportPage2";
import App2 from "./components/summa/App2";


export default function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/inspec_detail" element={<InspectionForm />} />
          {/* <Route path="/report" element={<ReportPage2 />} /> */}
          <Route path="/inspec_lit" element={<InspectionList />} />

          {/* ///// */}
          <Route path="/inspections" element={<InspectionForm2/>} />
         <Route path="/inspec_detail2/:id" element={<InspectionDetailPage />} />
         <Route path="/report/:id" element={<ReportPage2 />} />
         <Route path="/app2" element={<App2 />} />


        </Routes>
      </Router>

      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={12}
        containerStyle={{ top: 20 }}
        toastOptions={{
          // ← FIXED: Only one "duration:"
          duration: 4000,
          style: {
            background: '#1f2937',
            color: '#fff',
            fontWeight: '600',
            fontSize: '16px',
            borderRadius: '12px',
            padding: '16px 24px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
          },
          success: {
            icon: 'Success',
            style: { background: '#10b981' },
            duration: 3000,
          },
          error: {
            icon: 'Warning',
            style: { background: '#ef4444' },
            duration: 5000,
          },
        }}
      />
    </>
  );
}