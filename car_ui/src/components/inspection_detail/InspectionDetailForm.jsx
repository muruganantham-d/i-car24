import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";


import Step1Tyres from "./steps/Step1Tyres";
import Step2Brakes from "./steps/Step2Brakes";
import Step3Engine from "./steps/Step3Engine";
import Step4Exterior from "./steps/Step4Exterior";
import Step5Interior from "./steps/Step5Interior";
import Step6Electrical from "./steps/Step6Electrical";
import Step7Underbody from "./steps/Step7Underbody";
import Step8FluidsCompliance from "./steps/Step8FluidsCompliance";
import Step9SafetyLegal from "./steps/Step9SafetyLegal";
import Step10NotesVerification from "./steps/Step10NotesVerification";

import WizardProgress from "./WizardProgress";
import axios from "axios";
import Navbar from "../inspection/Navbar";

export default function InspectionDetailWizard() {
  const { id: inspection_id } = useParams();
  const navigate = useNavigate();

  // ----------------------------
  // GLOBAL STATE FOR ALL STEPS
  // ----------------------------
  const [formData, setFormData] = useState({
    // Step 1 fields
    tyre_fl_tread_pct: "",
    tyre_fr_tread_pct: "",
    tyre_rl_tread_pct: "",
    tyre_rr_tread_pct: "",
    tyre_fl_pressure_psi: "",
    tyre_fr_pressure_psi: "",
    tyre_rl_pressure_psi: "",
    tyre_rr_pressure_psi: "",
    tyre_spare_condition: "",
    tyre_age_months: "",
    photos_tyre: [],

    // Step 2 fields
brake_fl_pad_pct: "",
brake_fr_pad_pct: "",
brake_rl_pad_pct: "",
brake_rr_pad_pct: "",

brake_fl_disc_condition: "",
brake_fr_disc_condition: "",
brake_rl_disc_condition: "",
brake_rr_disc_condition: "",

photos_brake: [],

// Step 3 fields
engine_noise: "",
engine_vibration: "",
engine_oil_level: "",
engine_oil_leak: "",
coolant_level: "",
coolant_leak: "",
exhaust_smoke: "",
belt_condition: "",
engine_mounts_condition: "",
battery_status: "",
battery_voltage: "",
transmission_condition: "",
photos_engine: [],

// Step 4 fields
front_bumper: "",
rear_bumper: "",
left_fender: "",
right_fender: "",
left_front_door: "",
left_rear_door: "",
right_front_door: "",
right_rear_door: "",
bonnet: "",
roof: "",
trunk: "",
paint_consistency: "",
windshield_condition: "",
photos_exterior: [],

// Step 5 fields
seat_condition_front: "",
seat_condition_rear: "",
dashboard_condition: "",
steering_condition: "",
gear_shift_condition: "",
odometer_working: "",
ac_cooling: "",
ac_airflow: "",
roofliner_condition: "",
interior_odour: "",
photos_interior: [],

// Step 6 fields
headlights_status: "",
tail_lights_status: "",
indicators_status: "",
horn_status: "",
power_windows_status: "",
central_locking_status: "",
wipers_status: "",
infotainment_status: "",
photos_electrical: [],

// Step 7 fields
suspension_noise: "",
shock_absorber_condition: "",
bush_condition: "",
chassis_rust: "",
oil_leak_underbody: "",
exhaust_condition: "",
photos_undercarriage: [],

// Step 8 fields
brake_fluid_level: "",
transmission_fluid_level: "",
power_steering_fluid: "",
washer_fluid: "",
coolant_type: "",
last_oil_change_km: "",
service_book_present: "",
service_last_date: "",
photos_fluids: [],

// Step 9 fields
airbags_status: "",
seatbelt_condition: "",
emission_test: "",
registration_valid: "",
insurance_valid: "",

// Step 10 fields
roadworthy_notes: "",
previous_accident_notes: "",
additional_notes: "",
odo_verified: "",
owner_reference: "",

    // ... Will auto fill through steps
  });

  // Step number
  const [step, setStep] = useState(1);

  // ----------------------------
  // Move to next step
  // ----------------------------
  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  // ----------------------------
  // FINAL SUBMIT
  // ----------------------------
  const submitFinal = async () => {
    try {
      const fd = new FormData();
      fd.append("inspection_id", inspection_id);

      // append scalar fields
      Object.entries(formData).forEach(([key, value]) => {
        if (!key.startsWith("photos_")) {
          fd.append(key, value);
        }
      });

      // append photo arrays
      Object.entries(formData)
        .filter(([key]) => key.startsWith("photos_"))
        .forEach(([key, files]) => {
          files.forEach((file) => fd.append(`${key}[]`, file));
        });

      const res = await axios.post(
        "http://localhost:4000/api/inspection-details",
        fd,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert("Inspection Details Saved!");
      navigate(`/report/${inspection_id}`);
    } catch (err) {
      console.error(err);
      alert("Saving failed");
    }
  };

  // ----------------------------
  // RENDER CURRENT STEP
  // ----------------------------
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Step1Tyres
            data={formData}
            setData={setFormData}
            next={nextStep}
          />
        );
      case 2:
        return (
          <Step2Brakes
            data={formData}
            setData={setFormData}
            next={nextStep}
            prev={prevStep}
          />
        );
      case 3:
        return <Step3Engine data={formData} setData={setFormData} next={nextStep} prev={prevStep} />;
      case 4:
        return <Step4Exterior data={formData} setData={setFormData} next={nextStep} prev={prevStep} />;
      case 5:
        return <Step5Interior data={formData} setData={setFormData} next={nextStep} prev={prevStep} />;
         case 6:
        return <Step6Electrical data={formData} setData={setFormData} next={nextStep} prev={prevStep} />;
      case 7:
        return <Step7Underbody data={formData} setData={setFormData} next={nextStep} prev={prevStep} />;
      case 8:
        return <Step8FluidsCompliance data={formData} setData={setFormData} next={nextStep} prev={prevStep} />;
      case 9:
        return <Step9SafetyLegal data={formData} setData={setFormData} next={nextStep} prev={prevStep}/>;
          case 10:
        return <Step10NotesVerification data={formData} setData={setFormData} prev={prevStep} submit={submitFinal} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navbar />

      <div className="max-w-4xl mx-auto mt-6 bg-white p-6 rounded-xl shadow-lg">
        <WizardProgress step={step} total={10} />
        {renderStep()}
      </div>
    </div>
  );
}
