// src/components/ScanMyCarInspectionForm.jsx   (FINAL FIXED & PERFECT)

import React, { useState, useEffect } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight, Car, Camera, Upload, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

const TOTAL_STEPS = 10;

export default function ScanMyCarInspectionForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [photos, setPhotos] = useState([]);
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    brand: "", model: "", year: "", mileage: "", vin: "", plate: "", color: "", fuel_type: "",
    accident_history: "No", service_records: "Available",
    body_condition: "Good", dents: "None", scratches: "Minor", repainted_areas: "None", rust: "None",
    paint_type: "Original", paint_condition: "Excellent", fading: "None", clear_coat_peeling: "No",
    front_bumper: "Good", rear_bumper: "Good", hood: "Good", trunk: "Good", roof: "Good",
    left_fender: "Good", right_fender: "Good",
    left_front_door: "Good", left_rear_door: "Good", right_front_door: "Good", right_rear_door: "Good",
    engine_starts: "Yes", engine_noise: "Normal", exhaust_smoke: "None", oil_leaks: "No", overheating: "No",
    windshield: "Good", rear_glass: "Good", side_glass: "Good", sunroof: "Good",
    ac_cooling: "Excellent", ac_heating: "Working", blower_speed: "All Working", ac_smell: "No",
    coolant_level: "Good", engine_oil: "Good", brake_fluid: "Good", power_steering: "Good", battery: "Good",
    brake_pads: "Good", brake_discs: "Good", hand_brake: "Working", abs_light: "No",
    headlights: "Both Working", taillights: "Both Working", indicators: "All Working", wipers: "Working",
    central_lock: "Working", power_windows: "All Working", infotainment: "Fully Working", reverse_camera: "Clear",
  });

  const steps = ["Details", "Body", "Paint", "Exterior", "Engine", "Glass", "AC/Heat", "Engine Parts", "Brakes", "Electrical"];
  const progress = (currentStep / TOTAL_STEPS) * 100;

// 1. RESTORE FROM LOCALSTORAGE — NOW 100% SAFE & PERFECT
useEffect(() => {
  const saved = localStorage.getItem("inspectionDraft");
  if (!saved) return;

  try {
    const parsed = JSON.parse(saved);

    // Only restore if formData exists and has real data
    if (parsed.formData && typeof parsed.formData === "object" && Object.keys(parsed.formData).length > 0) {
      // SAFE MERGE: Keep defaults, only override what user actually filled
      setFormData(currentDefaults => ({
        ...currentDefaults,        // Keep all default values (Good, No, Yes, etc.)
        ...parsed.formData         // Only override what was saved
      }));
    }

    // Restore step
    if (parsed.step && parsed.step >= 1 && parsed.step <= TOTAL_STEPS) {
      setCurrentStep(parsed.step);
    }

    // Friendly message
    const step = parsed.step || 1;
    if (parsed.hasPhotos) {
     toast.success(`Welcome back! Restored to Step ${step}`, {
    duration: 5000,
    icon: 'Car',
  });
    } else {
     toast.success(`Progress restored! You're on Step ${step}`, {
  duration: 4500,
  icon: 'Car',
});
    }

  } catch (err) {
    console.error("Corrupted draft:", err);
    localStorage.removeItem("inspectionDraft");
    toast.error("Saved data was corrupted — Starting fresh", {
    duration: 6000,
    icon: 'Warning',
  });
  }
}, []);


// 2. SAVE TO LOCALSTORAGE — ULTRA SAFE
useEffect(() => {
  const dataToSave = {
    formData,                    // Full current form (with defaults + user input)
    step: currentStep,
    hasPhotos: photoPreviews.length > 0,
    timestamp: new Date().toISOString(),
  };

  try {
    localStorage.setItem("inspectionDraft", JSON.stringify(dataToSave));
  } catch (err) {
    console.warn("LocalStorage full or blocked", err);
  }
}, [formData, currentStep, photoPreviews.length]);
  // VALIDATION
  const validateCurrentStep = () => {
    const newErrors = {};
    let isValid = true;

    const required = {
      1: ["brand", "model", "year", "mileage", "vin", "plate"],
      2: ["body_condition"],
      3: ["paint_type"],
      4: ["front_bumper", "rear_bumper", "hood", "trunk"],
      5: ["engine_starts", "engine_noise"],
      6: ["windshield"],
      7: ["ac_cooling"],
      8: ["coolant_level", "engine_oil"],
      9: ["brake_pads"],
    };

    (required[currentStep] || []).forEach(field => {
      if (!formData[field] || formData[field].trim() === "") {
        newErrors[field] = true;
        isValid = false;
      }
    });

    if (currentStep === 10 && photoPreviews.length < 3) {
      newErrors.photos = true;
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) {
   toast.error("Please complete all required fields", {
  duration: 5000,
  icon: 'Warning',
  style: {
    background: '#ef4444',
    color: 'white',
    fontWeight: '600',
  },
});
      return;
    }
    if (currentStep < TOTAL_STEPS) setCurrentStep(c => c + 1);
  };

  const handlePrev = () => currentStep > 1 && setCurrentStep(c => c - 1);
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

const handlePhotoChange = (e) => {
  const files = Array.from(e.target.files);
  if (files.length === 0) return;

  setPhotos(files);
  const previews = files.map(f => URL.createObjectURL(f));
  setPhotoPreviews(previews);

  // Optional: Show friendly message
 toast.success(`${files.length} photo(s) selected! Ready to submit`, {
  duration: 4000,
  icon: 'Camera',
  style: {
    background: '#10b981',
    color: 'white',
    fontWeight: '600',
  },
});
};

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;
    setLoading(true);
    const data = new FormData();
    console.log(data,"data11111");
    
    Object.entries(formData).forEach(([k, v]) => data.append(k, v));
    photos.forEach(file => data.append("photos", file));

    try {
      // Replace with your real backend URL
      const res = await axios.post("http://localhost:4000/api/inspections", data);
      localStorage.removeItem("inspectionDraft"); // Clear after success
      toast.success("Report Created Successfully!", {
    duration: 5000,
    icon: 'Checkmark',
    style: {
      background: '#10b981',
      color: 'white',
      fontSize: '18px',
      fontWeight: 'bold',
      borderRadius: '16px',
      padding: '20px 30px',
      boxShadow: '0 20px 40px rgba(16, 185, 129, 0.3)',
    },
  });
      window.open(`/report/${res.data.id}`, "_blank");
    } catch (err) {
   toast.error("Submission failed. Please check your connection and try again.", {
  duration: 7000,
  icon: 'Warning',
  style: {
    background: '#ef4444',
    color: 'white',
    fontWeight: '600',
    fontSize: '16px',
  },
});
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <Step1 data={formData} onChange={handleChange} errors={errors} />;
      case 2: return <Step2 data={formData} onChange={handleChange} errors={errors} />;
      case 3: return <Step3 data={formData} onChange={handleChange} errors={errors} />;
      case 4: return <Step4 data={formData} onChange={handleChange} errors={errors} />;
      case 5: return <Step5 data={formData} onChange={handleChange} errors={errors} />;
      case 6: return <Step6 data={formData} onChange={handleChange} errors={errors} />;
      case 7: return <Step7 data={formData} onChange={handleChange} errors={errors} />;
      case 8: return <Step8 data={formData} onChange={handleChange} errors={errors} />;
      case 9: return <Step9 data={formData} onChange={handleChange} errors={errors} />;
      case 10: return <Step10 data={formData} onChange={handleChange} photos={photoPreviews} onPhotoChange={handlePhotoChange} errors={errors} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-lg mb-4">
            <Car className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Vehicle Inspection Report</h1>
          </div>
          <p className="text-xl text-gray-700">Step {currentStep} of {TOTAL_STEPS} — {steps[currentStep - 1]}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border p-8 mb-10">
          <div className="relative h-5 bg-gray-200 rounded-full overflow-hidden mb-6">
            <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-700 rounded-full flex items-center justify-end pr-4 text-white font-bold text-sm"
              style={{ width: `${progress}%` }}>
              {Math.round(progress)}% Complete
            </div>
          </div>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-3 text-center text-sm font-bold">
            {steps.map((_, i) => (
              <div key={i} className={`py-2 rounded-lg ${currentStep > i ? "bg-blue-600 text-white" : currentStep === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"}`}>
                {i + 1}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl border overflow-hidden">
          <div className="p-8 lg:p-12 min-h-[600px]">{renderStep()}</div>

          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-8 border-t flex flex-col sm:flex-row justify-between items-center gap-6">
            <button onClick={handlePrev} disabled={currentStep === 1}
              className={`flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-lg transition ${currentStep === 1 ? "bg-gray-300 text-gray-500" : "bg-white border-2 border-gray-300 hover:bg-gray-50"}`}>
              <ChevronLeft className="w-6 h-6" /> Previous
            </button>

            {currentStep === TOTAL_STEPS ? (
              <button onClick={handleSubmit} disabled={loading}
                className="flex items-center gap-4 px-12 py-5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold text-xl hover:from-green-700 hover:to-emerald-700 shadow-xl transform hover:scale-105 transition">
                {loading ? "Submitting..." : <>Submit Final Report <CheckCircle2 className="w-8 h-8" /></>}
              </button>
            ) : (
              <button onClick={handleNext}
                className="flex items-center gap-4 px-12 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-xl hover:from-blue-700 hover:to-indigo-700 shadow-xl transform hover:scale-105 transition">
                Next Step <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* REUSABLE COMPONENTS */
const Input = ({ label, errors, name, ...props }) => (
  <div>
    <label className="block text-sm font-bold text-gray-700 mb-2">
      {label} <span className="text-red-500">*</span>
    </label>

    <input
      className={`w-full px-5 py-4 border-2 rounded-xl transition text-lg 
      ${errors?.[name]
          ? "border-red-500 ring-4 ring-red-100"
          : "border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      }`}
      name={name}
      {...props}
    />

    {errors?.[name] && (
      <p className="text-red-600 text-sm mt-2 font-semibold">
        This field is required.
      </p>
    )}
  </div>
);


const Dropdown = ({ label, options, errors, name, ...props }) => (
  <div>
    <label className="block text-sm font-bold text-gray-700 mb-2">
      {label} <span className="text-red-500">*</span>
    </label>

    <select
      className={`w-full px-5 py-4 border-2 rounded-xl transition text-lg bg-white 
      ${errors?.[name]
          ? "border-red-500 ring-4 ring-red-100"
          : "border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      }`}
      name={name}
      {...props}
    >
      <option value="">Select...</option>
      {options.map(opt => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>

    {errors?.[name] && (
      <p className="text-red-600 text-sm mt-2 font-semibold">
        This field is required.
      </p>
    )}
  </div>
);

const Step1 = ({ data, onChange, errors }) => (
  <div className="space-y-8">
    <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
      <Car className="w-9 h-9 text-blue-600" /> 1. Vehicle Details
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Input label="Brand" name="brand" value={data.brand || ""} onChange={onChange} errors={errors} placeholder="Toyota" />
      <Input label="Model" name="model" value={data.model || ""} onChange={onChange} errors={errors} placeholder="Camry" />
      <Input label="Year" name="year" type="number" value={data.year || ""} onChange={onChange} errors={errors} placeholder="2023" />
      <Input label="Mileage (km)" name="mileage" value={data.mileage || ""} onChange={onChange} errors={errors} placeholder="45,820" />
      <Input label="VIN" name="vin" value={data.vin || ""} onChange={onChange} errors={errors} placeholder="1HGBH41JXMN109186" />
      <Input label="Plate Number" name="plate" value={data.plate || ""} onChange={onChange} errors={errors} placeholder="DXB A 12345" />
      <Dropdown label="Accident History" name="accident_history" value={data.accident_history} onChange={onChange} errors={errors}
        options={["No", "Minor", "Major", "Repaired"]} />
      <Dropdown label="Service Records" name="service_records" value={data.service_records} onChange={onChange} errors={errors}
        options={["Available", "Partial", "Not Available"]} />
    </div>
  </div>
);

const Step2 = ({ data, onChange, errors }) => (
  <div className="space-y-8">
    <h2 className="text-3xl font-bold text-gray-900">2. Body Condition</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Dropdown label="Overall Body Condition" name="body_condition" value={data.body_condition} onChange={onChange} errors={errors}
        options={["Excellent", "Good", "Fair", "Poor"]} />
      <Dropdown label="Dents" name="dents" value={data.dents} onChange={onChange} errors={errors}
        options={["None", "Minor", "Multiple", "Major"]} />
      <Dropdown label="Scratches" name="scratches" value={data.scratches} onChange={onChange} errors={errors}
        options={["None", "Minor", "Deep", "Many"]} />
      <Dropdown label="Repainted Areas" name="repainted_areas" value={data.repainted_areas} onChange={onChange} errors={errors}
        options={["None", "Minor Touch-up", "Partial", "Full Body"]} />
      <Dropdown label="Rust" name="rust" value={data.rust} onChange={onChange} errors={errors}
        options={["None", "Surface", "Structural"]} />
    </div>
  </div>
);

const Step3 = ({ data, onChange, errors }) => (
  <div className="space-y-8">
    <h2 className="text-3xl font-bold text-gray-900">3. Paint Type & Condition</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Dropdown label="Paint Type" name="paint_type" value={data.paint_type} onChange={onChange} errors={errors}
        options={["Original", "Partial Repaint", "Full Repaint"]} />
      <Dropdown label="Paint Condition" name="paint_condition" value={data.paint_condition} onChange={onChange} errors={errors}
        options={["Excellent", "Good", "Faded", "Peeling"]} />
      <Dropdown label="Fading" name="fading" value={data.fading} onChange={onChange} errors={errors}
        options={["None", "Mild", "Severe"]} />
      <Dropdown label="Clear Coat Peeling" name="clear_coat_peeling" value={data.clear_coat_peeling} onChange={onChange} errors={errors}
        options={["No", "Yes"]} />
    </div>
  </div>
);

const Step4 = ({ data, onChange, errors }) => (
  <div className="space-y-8">
    <h2 className="text-3xl font-bold text-gray-900">4. Exterior Components</h2>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Object.keys(data).filter(k => k.includes("bumper") || k.includes("door") || k.includes("hood") || k.includes("trunk") || k.includes("roof") || k.includes("fender")).map(part => (
        <Dropdown key={part} label={part.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
          name={part} value={data[part]} onChange={onChange} errors={errors}
          options={["Good", "Scratched", "Dented", "Repaired", "Replaced"]} />
      ))}
    </div>
  </div>
);

const Step5 = ({ data, onChange, errors }) => (
  <div className="space-y-8">
    <h2 className="text-3xl font-bold text-gray-900">5. Engine</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Dropdown label="Engine Starts Properly" name="engine_starts" value={data.engine_starts} onChange={onChange} errors={errors}
        options={["Yes", "Hard Start", "No"]} />
      <Dropdown label="Engine Noise" name="engine_noise" value={data.engine_noise} onChange={onChange} errors={errors}
        options={["Normal", "Ticking", "Knocking", "High"]} />
      <Dropdown label="Exhaust Smoke" name="exhaust_smoke" value={data.exhaust_smoke} onChange={onChange} errors={errors}
        options={["None", "White", "Blue", "Black"]} />
      <Dropdown label="Oil Leaks" name="oil_leaks" value={data.oil_leaks} onChange={onChange} errors={errors}
        options={["No", "Minor", "Major"]} />
      <Dropdown label="Overheating Signs" name="overheating" value={data.overheating} onChange={onChange} errors={errors}
        options={["No", "Yes"]} />
    </div>
  </div>
);

// Step 6–10 (NEW)
const Step6 = ({ data, onChange, errors}) => (
  <div className="space-y-8"><h2 className="text-3xl font-bold text-gray-900">6. Glass Condition</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Dropdown label="Windshield" name="windshield" value={data.windshield} onChange={onChange} errors={errors} options={["Good", "Cracked", "Chipped", "Replaced"]} />
      <Dropdown label="Rear Glass" name="rear_glass" value={data.rear_glass} onChange={onChange} errors={errors} options={["Good", "Cracked", "Chipped"]} />
      <Dropdown label="Side Windows" name="side_glass" value={data.side_glass} onChange={onChange} errors={errors} options={["Good", "Scratched", "Not Working"]} />
      <Dropdown label="Sunroof (if available)" name="sunroof" value={data.sunroof} onChange={onChange} errors={errors} options={["Good", "Leaking", "Not Working", "N/A"]} />
    </div>
  </div>
);

const Step7 = ({ data, onChange, errors }) => (
  <div className="space-y-8"><h2 className="text-3xl font-bold text-gray-900">7. Climate Control</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Dropdown label="AC Cooling" name="ac_cooling" value={data.ac_cooling} onChange={onChange} errors={errors} options={["Excellent", "Good", "Weak", "Not Working"]} />
      <Dropdown label="Heater" name="ac_heating" value={data.ac_heating} onChange={onChange} errors={errors} options={["Working", "Weak", "Not Working"]} />
      <Dropdown label="Blower Speeds" name="blower_speed" value={data.blower_speed} onChange={onChange} errors={errors} options={["All Working", "Some Not", "None"]} />
      <Dropdown label="AC Smell" name="ac_smell" value={data.ac_smell} onChange={onChange} errors={errors} options={["No", "Mild", "Strong"]} />
    </div>
  </div>
);

const Step8 = ({ data, onChange, errors }) => (
  <div className="space-y-8"><h2 className="text-3xl font-bold text-gray-900">8. Engine Components</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Dropdown label="Coolant Level" name="coolant_level" value={data.coolant_level} onChange={onChange} errors={errors} options={["Good", "Low", "Leaking"]} />
      <Dropdown label="Engine Oil Condition" name="engine_oil" value={data.engine_oil} onChange={onChange} errors={errors} options={["Good", "Dirty", "Low"]} />
      <Dropdown label="Brake Fluid" name="brake_fluid" value={data.brake_fluid} onChange={onChange} errors={errors} options={["Good", "Low", "Dirty"]} />
      <Dropdown label="Power Steering Fluid" name="power_steering" value={data.power_steering} onChange={onChange} errors={errors} options={["Good", "Low", "Leaking"]} />
      <Dropdown label="Battery Health" name="battery" value={data.battery} onChange={onChange} errors={errors} options={["Good", "Weak", "Dead"]} />
    </div>
  </div>
);

const Step9 = ({ data, onChange, errors }) => (
  <div className="space-y-8">
    <h2 className="text-3xl font-bold text-gray-900">9. Brakes</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Dropdown label="Brake Pads Condition" name="brake_pads" value={data.brake_pads} onChange={onChange} errors={errors}
        options={["Good (>70%)", "Average (30-70%)", "Thin (<30%)", "Metal on Metal"]} />
      <Dropdown label="Brake Discs/Rotors" name="brake_discs" value={data.brake_discs} onChange={onChange} errors={errors}
        options={["Good", "Grooved", "Warped", "Rusted"]} />
      <Dropdown label="Hand Brake" name="hand_brake" value={data.hand_brake} onChange={onChange} errors={errors}
        options={["Strong", "Working", "Weak", "Not Working"]} />
      <Dropdown label="ABS Warning Light" name="abs_light" value={data.abs_light} onChange={onChange} errors={errors}
        options={["No", "Yes"]} />
    </div>
  </div>
);
/* ALL STEPS - Only showing Step10 with photo error fix */
const Step10 = ({ data, onChange, photos, onPhotoChange, errors }) => (
  <div className="space-y-10">
    <h2 className="text-3xl font-bold text-gray-900">10. Electrical & Features + Photos</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Dropdown label="Headlights" name="headlights" value={data.headlights} onChange={onChange}  errors={errors} options={["Both Working", "One Out", "Both Out", "Dim"]} />
      <Dropdown label="Tail Lights" name="taillights" value={data.taillights} onChange={onChange}  errors={errors} options={["Both Working", "One Out", "Both Out"]} />
      <Dropdown label="Indicators" name="indicators" value={data.indicators} onChange={onChange}  errors={errors} options={["All Working", "Fast Blink", "Not Working"]} />
      <Dropdown label="Wipers" name="wipers" value={data.wipers} onChange={onChange} errors={errors}  options={["Working", "Slow", "Noisy", "Not Working"]} />
      <Dropdown label="Central Locking" name="central_lock" value={data.central_lock} onChange={onChange}  errors={errors} options={["Working", "Key Only", "Not Working"]} />
      <Dropdown label="Power Windows" name="power_windows" value={data.power_windows} onChange={onChange} errors={errors} options={["All Working", "1-2 Not", "None Working"]} />
      <Dropdown label="Infotainment" name="infotainment" value={data.infotainment} onChange={onChange}  errors={errors} options={["Fully Working", "Touch Issue", "No Sound", "Dead"]} />
      <Dropdown label="Reverse Camera" name="reverse_camera" value={data.reverse_camera} onChange={onChange} errors={errors} options={["Clear", "Blurry", "Lines", "Not Working", "N/A"]} />
    </div>

    <div className={`mt-12 p-10 rounded-3xl border-4 border-dashed ${errors.photos ? "border-red-500 bg-red-50" : "border-blue-300 bg-blue-50"}`}>
      <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-4">
        <Camera className="w-10 h-10 text-blue-600" /> Upload Vehicle Photos (Minimum 3 Required)
      </h3>
      {errors.photos && <p className="text-red-600 font-bold text-xl mb-4">Please upload at least 3 photos!</p>}
      <div className="text-center">
        <Upload className="w-20 h-20 text-blue-600 mx-auto mb-6" />
        <input type="file" multiple accept="image/*" onChange={onPhotoChange}
          className="block w-full max-w-md mx-auto text-lg file:mr-6 file:py-4 file:px-10 file:rounded-full file:border-0 file:bg-gradient-to-r file:from-blue-600 file:to-indigo-600 file:text-white" />
      </div>

      {photos.length > 0 && (
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {photos.map((src, i) => (
            <img key={i} src={src} alt="" className="w-full h-48 object-cover rounded-2xl shadow-xl border-4 border-white" />
          ))}
        </div>
      )}
    </div>
  </div>
);

// Keep all other Step1 to Step9 exactly the same as before (just add errors={errors} prop)


// Steps 1–5 (same as before — shortened for space)

