import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";


/**
 * Premium Single Page Inspection Form
 * - dynamic, optimized
 * - uses react-hook-form + zod
 * - multiple image uploads with previews (per-inspection single photos_json)
 * - sends multipart/form-data to POST /api/inspections
 *
 * NOTE: The sample preview image references the uploaded local path:
 * "/mnt/data/59505931-9f5c-452a-afcc-d50b4ecd855c.png"
 * Your environment/tooling will transform this path to an accessible URL.
 */

/* -----------------------
   Validation schema (zod)
   ----------------------- */
const nowYear = new Date().getFullYear();
const schema = z.object({
  client_name: z.string().min(2, "Client name is required"),
  client_phone: z
    .string()
    .min(7, "Enter a valid phone")
    .max(20)
    .regex(/^[0-9 +()-]+$/i, "Phone contains invalid characters"),
  inspector_name: z.string().min(2, "Inspector name is required"),
  vehicle_make: z.string().min(1, "Make required"),
  vehicle_model: z.string().min(1, "Model required"),
  vehicle_year: z
    .number()
    .int()
    .gte(1900, "Year must be >= 1900")
    .lte(nowYear + 1, `Year must be <= ${nowYear + 1}`),
  vin: z.string().optional().nullable(),
  plate_number: z.string().optional().nullable(),
  mileage: z.number().int().min(0).optional().nullable(),
  fuel_type: z
    .enum(["Petrol", "Diesel", "CNG", "Hybrid", "Electric", "Other"])
    .optional(),
  seating_capacity: z.number().int().min(1).max(100).optional().nullable(),
  color: z.string().optional().nullable(),
  test_drive: z.boolean(),
  car_registered_in: z.string().optional().nullable(),
  overall_condition: z
    .enum(["Excellent", "Good", "Average", "Poor"])
    .optional(),
  remarks: z.string().optional().nullable()
});

/* -----------------------
   Default dynamic lists
   ----------------------- */
const FUEL_OPTIONS = ["Petrol", "Diesel", "CNG", "Hybrid", "Electric", "Other"];
const CONDITION_OPTIONS = ["Excellent", "Good", "Average", "Poor"];
const SEATING_OPTIONS = Array.from({ length: 12 }, (_, i) => i + 1); // 1..12
const COLOR_SUGGESTIONS = [
  "White",
  "Black",
  "Silver",
  "Grey",
  "Blue",
  "Red",
  "Green",
  "Brown",
  "Other"
];

/* -----------------------
   Helper small UI pieces
   ----------------------- */
const Input = ({ label, id, registerProps, error, type = "text", ...rest }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      id={id}
      type={type}
      {...registerProps}
      {...rest}
      className={clsx(
        "w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2",
        error ? "border-red-400 focus:ring-red-200" : "border-gray-200 focus:ring-blue-200"
      )}
    />
    {error && <p className="text-xs text-red-600 mt-1">{error.message}</p>}
  </div>
);

const Select = ({ label, id, children, error, ...rest }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <select
      id={id}
      {...rest}
      className={clsx(
        "w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2",
        error ? "border-red-400 focus:ring-red-200" : "border-gray-200 focus:ring-blue-200"
      )}
    >
      {children}
    </select>
    {error && <p className="text-xs text-red-600 mt-1">{error.message}</p>}
  </div>
);

/* -----------------------
   Main Component
   ----------------------- */
export default function InspectionForm2() {
  const navigate = useNavigate?.() || (() => {});

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      client_name: "",
      client_phone: "",
      inspector_name: "",
      vehicle_make: "",
      vehicle_model: "",
      vehicle_year: nowYear,
      vin: "",
      plate_number: "",
      mileage: 0,
      fuel_type: "Petrol",
      seating_capacity: 5,
      color: "White",
      test_drive: false,
      car_registered_in: "",
      overall_condition: "Good",
      remarks: ""
    },
    mode: "onBlur"
  });

  // images state (File objects)
  const [images, setImages] = useState([]);
  // sample preview from your uploaded file (dev instruction). This path will be transformed to a URL by your environment.
  const sampleLocalPath = "/mnt/data/59505931-9f5c-452a-afcc-d50b4ecd855c.png";

  // derived preview URLs for File objects (objectURL)
  const previewUrls = useMemo(() => {
    const urls = images.map((file) => ({
      file,
      url: URL.createObjectURL(file)
    }));
    return urls;
  }, [images]);

  // cleanup object URLs on unmount / change
  useEffect(() => {
    return () => previewUrls.forEach((p) => p && URL.revokeObjectURL(p.url));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // watch certain fields for live UI updates
  const watched = watch(["vehicle_make", "vehicle_model", "vehicle_year", "mileage"]);

  // image add handler (drag/drop or file input)
  const onFilesSelected = useCallback(
    (fileList) => {
      const files = Array.from(fileList || []).filter((f) => f.type.startsWith("image/"));
      if (!files.length) return;
      // limit total images (optimised)
      const MAX = 20;
      const next = [...images, ...files].slice(0, MAX);
      setImages(next);
    },
    [images]
  );

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // clear images
  const clearImages = () => setImages([]);

  // Build FormData and submit
  const onSubmit = async (values) => {
    try {
      const form = new FormData();
      // append scalar fields
      form.append("client_name", values.client_name);
      form.append("client_phone", values.client_phone);
      form.append("inspector_name", values.inspector_name);
      form.append("vehicle_make", values.vehicle_make);
      form.append("vehicle_model", values.vehicle_model);
      form.append("vehicle_year", String(values.vehicle_year));
      if (values.vin) form.append("vin", values.vin);
      if (values.plate_number) form.append("plate_number", values.plate_number);
      form.append("mileage", String(values.mileage ?? 0));
      if (values.fuel_type) form.append("fuel_type", values.fuel_type);
      if (values.seating_capacity) form.append("seating_capacity", String(values.seating_capacity));
      if (values.color) form.append("color", values.color);
      form.append("test_drive", values.test_drive ? "1" : "0");
      if (values.car_registered_in) form.append("car_registered_in", values.car_registered_in);
      if (values.overall_condition) form.append("overall_condition", values.overall_condition);
      if (values.remarks) form.append("remarks", values.remarks);

      // append images under same key photos (backend expects 'photos' multiple files)
      images.forEach((file) => {
        form.append("photos", file, file.name);
      });

      // send to backend
      const res = await axios.post("http://localhost:4000/api/inspections", form, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      // expected: { id, pdfUrl, shareUrl }
      const id = res?.data?.id;
      // navigate to report page (if your app uses react-router)
      if (id) {
       navigate(`/inspec_detail2/${id}`);
      } else {
        alert("Submitted (no id returned). Check server response.");
      }
    } catch (err) {
      console.error(err);
      alert("Submission failed. Check console for details.");
    }
  };

  /* -----------------------
     Render
     ----------------------- */
  return (
 <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
          <Navbar />

     <div className="max-w-3xl mx-auto p-6 pt-8">
    <div className="bg-white rounded-xl shadow-md p-6">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Inspection — Submit Report</h1>
          <p className="text-sm text-gray-500 mt-1">
            Complete required fields and upload photos.
          </p>
        </header>


        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Row: Client + Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                label="Client Name"
                id="client_name"
                registerProps={register("client_name")}
                error={errors.client_name}
                placeholder="John Doe"
              />
            </div>
            <div>
              <Input
                label="Client Phone"
                id="client_phone"
                registerProps={register("client_phone")}
                error={errors.client_phone}
                placeholder="+91 98XXXXXXXX"
              />
            </div>
          </div>

          {/* Inspector */}
          <Input
            label="Inspector Name"
            id="inspector_name"
            registerProps={register("inspector_name")}
            error={errors.inspector_name}
            placeholder="Inspector full name"
          />

          {/* Vehicle section */}
          <div className="text-sm font-medium text-gray-700 mt-2 mb-2">Vehicle Information</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Make"
              id="vehicle_make"
              registerProps={register("vehicle_make")}
              error={errors.vehicle_make}
              placeholder="Toyota"
            />
            <Input
              label="Model"
              id="vehicle_model"
              registerProps={register("vehicle_model")}
              error={errors.vehicle_model}
              placeholder="Corolla"
            />
            <Input
              label="Year"
              id="vehicle_year"
              type="number"
              registerProps={register("vehicle_year", { valueAsNumber: true })}
              error={errors.vehicle_year}
              min="1900"
              max={nowYear + 1}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="VIN / Chassis"
              id="vin"
              registerProps={register("vin")}
              error={errors.vin}
            />
            <Input
              label="Plate Number"
              id="plate_number"
              registerProps={register("plate_number")}
              error={errors.plate_number}
            />
            <Input
              label="Mileage (km)"
              id="mileage"
              type="number"
              registerProps={register("mileage", { valueAsNumber: true })}
              error={errors.mileage}
              min="0"
            />
          </div>

          {/* dynamic selects */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            <Controller
              name="fuel_type"
              control={control}
              render={({ field }) => (
                <Select label="Fuel Type" id="fuel_type" {...field} error={errors.fuel_type}>
                  {FUEL_OPTIONS.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </Select>
              )}
            />

<Controller
  name="seating_capacity"
  control={control}
  render={({ field }) => (
    <Select
      label="Seating Capacity"
      id="seating_capacity"
      value={field.value}
      onChange={(e) => field.onChange(Number(e.target.value))}
      error={errors.seating_capacity}
    >
      {SEATING_OPTIONS.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </Select>
  )}
/>

            <Controller
              name="color"
              control={control}
              render={({ field }) => (
                <Select label="Color" id="color" {...field} error={errors.color}>
                  {COLOR_SUGGESTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Select>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Test Drive</label>
              <Controller
                name="test_drive"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center gap-4">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        {...field}
                        checked={!!field.value}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600"
                      />
                      <span className="ml-2 text-sm text-gray-700">Performed</span>
                    </label>
                  </div>
                )}
              />
            </div>

            <Input
              label="Car Registered In (City / State)"
              id="car_registered_in"
              registerProps={register("car_registered_in")}
            />

            <Controller
              name="overall_condition"
              control={control}
              render={({ field }) => (
                <Select label="Overall Condition" id="overall_condition" {...field}>
                  {CONDITION_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Select>
              )}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
            <textarea
              {...register("remarks")}
              rows={4}
              className="w-full rounded-md border px-3 py-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {/* Photos upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Photos (up to 20)</label>

            <div className="flex gap-3 items-center">
              <label className="inline-flex items-center px-3 py-2 bg-white border rounded-md cursor-pointer text-sm hover:bg-gray-50">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => onFilesSelected(e.target.files)}
                />
                Upload Photos
              </label>

              <button
                type="button"
                onClick={() => {
                  // add sample local asset as demonstration (dev tool will transform path to real URL)
                  fetch(sampleLocalPath)
                    .then((r) => r.blob())
                    .then((blob) => {
                      const f = new File([blob], "sample.png", { type: blob.type || "image/png" });
                      onFilesSelected([f]);
                    })
                    .catch(() => {
                      // fallback: programmatic create one empty placeholder
                      alert("Sample file not available in this environment.");
                    });
                }}
                className="px-3 py-2 bg-gray-50 border rounded-md text-sm"
              >
                Add Example Photo
              </button>

              <button
                type="button"
                onClick={clearImages}
                className="px-3 py-2 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm"
              >
                Clear
              </button>
            </div>

            {/* preview grid */}
            <div className="mt-3 grid grid-cols-3 md:grid-cols-6 gap-2">
              {/* show any uploaded images previews */}
              {previewUrls.length > 0 ? (
                previewUrls.map((p, idx) => (
                  <div key={idx} className="relative border rounded-md overflow-hidden">
                    <img src={p.url} alt={`preview-${idx}`} className="w-full h-24 object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 bg-white/80 rounded-full p-1 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-400 col-span-6">
                  No photos added. Use Upload Photos or Add Example Photo.
                </div>
              )}
            </div>
          </div>

          {/* footer submit */}
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-500">
              <div>Fields marked required will be validated before submission.</div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className={clsx(
                  "px-5 py-2 rounded-md text-white",
                  isSubmitting ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
                )}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
</div>
  );
}
