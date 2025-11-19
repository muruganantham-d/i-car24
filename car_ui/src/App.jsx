// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import InspectionForm from "./components/InspectionForm";
import ReportPage from "./components/ReportPage";
import InspectionList from "./components/InspectionList";

export default function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<InspectionForm />} />
          <Route path="/report/:id" element={<ReportPage />} />
          <Route path="/inspections" element={<InspectionList />} />
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