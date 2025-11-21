import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="w-full bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Left - Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="h-9 w-9 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
            I
          </div>
          <span className="text-lg font-semibold text-gray-800">InspectPro</span>
        </Link>

        {/* Right - Menu */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
          <Link to="/inspections" className="hover:text-blue-600">
            All Inspections
          </Link>

          <Link to="/create" className="hover:text-blue-600">
            Create Inspection
          </Link>

          <button
            onClick={() => navigate("/profile")}
            className="hover:text-blue-600"
          >
            Profile
          </button>

          <button
            onClick={() => navigate("/logout")}
            className="px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100"
          >
            Logout
          </button>
        </div>

        {/* Mobile menu icon */}
        <div className="md:hidden">
          <button className="text-gray-700 text-xl">☰</button>
        </div>
      </div>
    </nav>
  );
}
