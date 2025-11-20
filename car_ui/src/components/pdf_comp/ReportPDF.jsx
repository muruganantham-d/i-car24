// ReportPDFPremiumFull.jsx
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
  Svg,
  Path,
  Rect,
  Circle,
  Line,
} from "@react-pdf/renderer";

// Optionally register fonts if you have them available in your build
// Font.register({ family: "Inter", src: "/fonts/Inter-Regular.ttf" });

const styles = StyleSheet.create({
  page: {
    padding: 36,
    backgroundColor: "#FFFFFF",
    fontSize: 11,
    color: "#1A1A1A",
    fontFamily: "Helvetica",
  },
  header: {
    backgroundColor: "#F2F2F2",
    padding: 18,
    borderRadius: 8,
    marginBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: { flexDirection: "column", maxWidth: "78%" },
  headerTitle: { fontSize: 20, fontWeight: "bold" },
  headerSub: { marginTop: 6, fontSize: 10, color: "#555" },

  // Summary Card
  summaryCard: {
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    marginBottom: 16,
  },
  carImage: { width: 120, height: 88, borderRadius: 6, marginRight: 12 },
  summaryInfo: { flex: 1 },
  summaryTitle: { fontSize: 16, fontWeight: "bold" },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  summaryLabel: { color: "#666", fontSize: 10 },

  // Scores
  scoreContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  scoreBox: {
    width: "24%",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    borderWidth: 1,
  },
  scoreTitle: { fontSize: 11, marginBottom: 6, color: "#333" },
  scoreValue: { fontSize: 20, fontWeight: "bold" },

  // Section
  section: { marginBottom: 12 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  iconWrap: { width: 22, height: 22, marginRight: 8 },
  sectionTitle: { fontSize: 13, fontWeight: "bold", color: "#0055FF" },

  // Field row
  fieldRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  fieldLabel: { color: "#555", fontSize: 10 },
  fieldValue: { fontSize: 10 },

  // Photo grid
imageGrid: {
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "space-between",
  marginTop: 10,
},
photo: {
  width: "48%",   // exactly 2 per row
  height: 150,
  borderRadius: 8,
  borderWidth: 1,
  borderColor: "#E0E0E0",
  objectFit: "cover",
  marginBottom: 10,
},

  // footer
  footer: {
    marginTop: 18,
    borderTopWidth: 1,
    borderTopColor: "#EEE",
    paddingTop: 8,
    fontSize: 9,
    color: "#666",
  },
});

/* ---------- Inline flat SVG PDF_ICONS.car (data URIs) ---------- 
   Using simple flat monochrome SVGs so the PDF file-size stays small.
   We encode them as data:image/svg+xml;utf8,<svg...>
*/

const PDF_ICONS = {
  car: (
    <Svg width="20" height="20" viewBox="0 0 24 24">
      <Path fill="#6B7280" d="M3 13l1-3 2-5h12l2 5 1 3v7h-2v-2H5v2H3v-7zm5-8h8l2 5H6l2-5zm1 9a2 2 0 110 4 2 2 0 010-4zm8 0a2 2 0 110 4 2 2 0 010-4z"/>
    </Svg>
  ),

  scan: (
    <Svg width="20" height="20" viewBox="0 0 24 24">
      <Path stroke="#6B7280" strokeWidth="2" fill="none"
        d="M3 7V5a2 2 0 012-2h2M3 17v2a2 2 0 002 2h2M17 3h2a2 2 0 012 2v2M17 21h2a2 2 0 002-2v-2" />
      <Rect x="7" y="7" width="10" height="10" stroke="#6B7280" strokeWidth="2" fill="none" />
    </Svg>
  ),

  wrench: (
    <Svg width="20" height="20" viewBox="0 0 24 24">
      <Path fill="#6B7280"
        d="M21 7l-4.35 4.35a4 4 0 11-5.66 5.66L7 21l-4-4 4.35-4.35a4 4 0 015.66-5.66L21 7z"/>
    </Svg>
  ),

  fan: (
    <Svg width="20" height="20" viewBox="0 0 24 24">
      <Circle cx="12" cy="12" r="3" fill="#6B7280" />
      <Path stroke="#6B7280" strokeWidth="1.5"
        d="M12 1v4M12 19v4M1 12h4M19 12h4M4.2 4.2L7 7M17 17l2.8 2.8M4.2 19.8L7 17M17 7l2.8-2.8" />
    </Svg>
  ),

  window: (
    <Svg width="20" height="20" viewBox="0 0 24 24">
      <Rect x="3" y="4" width="18" height="16" rx="3" stroke="#6B7280" strokeWidth="2" fill="none" />
      <Line x1="3" y1="10" x2="21" y2="10" stroke="#6B7280" strokeWidth="2" />
    </Svg>
  ),

  clipboard: (
    <Svg width="20" height="20" viewBox="0 0 24 24">
      <Rect x="4" y="3" width="16" height="18" rx="2" stroke="#6B7280" strokeWidth="2" fill="none" />
      <Rect x="9" y="3" width="6" height="3" rx="1" fill="#6B7280" />
      <Circle cx="8" cy="12" r="1" fill="#6B7280" />
      <Circle cx="8" cy="16" r="1" fill="#6B7280" />
      <Line x1="11" y1="12" x2="17" y2="12" stroke="#6B7280" strokeWidth="2" />
      <Line x1="11" y1="16" x2="17" y2="16" stroke="#6B7280" strokeWidth="2" />
    </Svg>
  ),

  camera: (
    <Svg width="20" height="20" viewBox="0 0 24 24">
      <Path fill="#6B7280"
        d="M4 7h3l2-3h6l2 3h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V9a2 2 0 012-2zm8 3a4 4 0 100 8 4 4 0 000-8z"/>
    </Svg>
  ),
};


/* helper to create data URI for Image src in react-pdf */
const svgToDataUri = (svg) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

/* ---------- Field lists to ensure we show ALL details ---------- */
const BODY_FIELDS = [
  "body_condition",
  "dents",
  "scratches",
  "repainted_areas",
  "rust",
  "paint_type",
  "paint_condition",
  "fading",
  "clear_coat_peeling",
];

const EXTERIOR_FIELDS = [
  "front_bumper",
  "rear_bumper",
  "hood",
  "trunk",
  "roof",
  "left_front_door",
  "left_rear_door",
  "right_front_door",
  "right_rear_door",
  "left_fender",
  "right_fender",
  "mirror_left",
  "mirror_right",
  "wheel_condition",
  "tyre_tread_depth",
];

const ENGINE_FIELDS = [
  "engine_starts",
  "engine_noise",
  "exhaust_smoke",
  "oil_leaks",
  "overheating",
  "coolant_level",
  "engine_oil",
  "brake_fluid",
  "power_steering",
  "battery",
  "abs_light",
];

const AC_ELECTRICAL_FIELDS = [
  "ac_cooling",
  "ac_heating",
  "blower_speed",
  "ac_smell",
  "headlights",
  "taillights",
  "indicators",
  "wipers",
  "central_lock",
  "power_windows",
  "infotainment",
  "reverse_camera",
];

const GLASS_FIELDS = ["windshield", "rear_glass", "side_glass", "sunroof"];

const OTHER_FIELDS = [
  "accident_history",
  "service_records",
  "additional_observations",
  "inspector_notes",
];

/* Utility formatting helpers */
const formatLabel = (s) =>
  s
    ? s
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
    : "";

const calculateScore = (data, fields) => {
  if (!fields || fields.length === 0) return 0;
  const good = fields.filter(
    (f) => data[f] && String(data[f]).toLowerCase().includes("good")
  ).length;
  return Math.round((good / fields.length) * 100);
};

/* Flatten any extra fields present in data that are not in lists above */
// We'll show them at the end under "All Other Fields" to make sure nothing gets missed.
const getExtraFields = (data) => {
  const known = new Set([
    ...BODY_FIELDS,
    ...EXTERIOR_FIELDS,
    ...ENGINE_FIELDS,
    ...AC_ELECTRICAL_FIELDS,
    ...GLASS_FIELDS,
    ...OTHER_FIELDS,
    // summary/top level fields
    "brand",
    "model",
    "year",
    "vin",
    "plate",
    "mileage",
    "photos",
  ]);
  return Object.keys(data || {}).filter((k) => !known.has(k));
};

/* ------------------ Main PDF Component ------------------ */
const ReportPDFPremiumFull = ({ data = {} }) => {
  // ensure photos array exists
  const photos = Array.isArray(data.photos) ? data.photos : [];

  const extraFields = getExtraFields(data);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>
              {data.year || "—"} {data.brand || ""} {data.model || ""}
            </Text>
            <Text style={styles.headerSub}>
              Plate: {data.plate || "—"} | Mileage: {data.mileage || "—"} km |
              VIN: {data.vin || "—"}
            </Text>
            <Text style={styles.headerSub}>
              Report ID: {data.report_id || "—"} | Inspector:{" "}
              {data.inspector_name || "—"}
            </Text>
          </View>

          {/* Small detail block - right side */}
          <View>
            <Text style={{ fontSize: 12, fontWeight: "bold" }}>
              Inspection Summary
            </Text>
            <Text style={{ fontSize: 10, color: "#555", marginTop: 6 }}>
              Completed: {data.inspection_date || "—"}
            </Text>
          </View>
        </View>

        {/* Summary Card */}
        <View style={styles.summaryCard}>
          {photos[0] ? (
            <Image
              src={
                photos[0].base64
                  ? `data:${photos[0].mimeType || "image/jpeg"};base64,${
                      photos[0].base64
                    }`
                  : photos[0].uri || photos[0].src
              }
              style={styles.carImage}
            />
          ) : (
            <View
              style={{
                width: 120,
                height: 88,
                borderRadius: 6,
                backgroundColor: "#F3F3F3",
                marginRight: 12,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: "#EEE",
              }}
            >
              <Text style={{ fontSize: 10, color: "#AAA" }}>No Image</Text>
            </View>
          )}

          <View style={styles.summaryInfo}>
            <Text style={styles.summaryTitle}>
              {data.brand || "—"} {data.model || ""}
            </Text>

            <View style={{ marginTop: 8 }}>
              {[
                ["Year", data.year],
                ["Mileage", data.mileage ? `${data.mileage} KM` : undefined],
                ["Plate", data.plate],
                ["VIN", data.vin],
                ["Fuel Type", data.fuel_type],
                ["Transmission", data.transmission],
              ].map(([label, value]) => (
                <View style={styles.summaryRow} key={label}>
                  <Text style={styles.summaryLabel}>{label}</Text>
                  <Text>{value || "—"}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Score Boxes */}
        <View style={styles.scoreContainer}>
          <View
            style={[
              styles.scoreBox,
              { borderColor: "#0055FF", backgroundColor: "#FFFFFF" },
            ]}
          >
            <Text style={styles.scoreTitle}>Exterior</Text>
            <Text style={styles.scoreValue}>
              {calculateScore(data, [
                ...BODY_FIELDS,
                ...EXTERIOR_FIELDS,
              ])}
              %
            </Text>
          </View>

          <View
            style={[
              styles.scoreBox,
              { borderColor: "#00A65A", backgroundColor: "#FFFFFF" },
            ]}
          >
            <Text style={styles.scoreTitle}>Engine</Text>
            <Text style={styles.scoreValue}>
              {calculateScore(data, ENGINE_FIELDS)}%
            </Text>
          </View>

          <View
            style={[
              styles.scoreBox,
              { borderColor: "#FFC300", backgroundColor: "#FFFFFF" },
            ]}
          >
            <Text style={styles.scoreTitle}>Brakes</Text>
            <Text style={styles.scoreValue}>
              {calculateScore(data, ["brake_pads", "brake_discs", "hand_brake"])}%
            </Text>
          </View>

          <View
            style={[
              styles.scoreBox,
              { borderColor: "#A02ED6", backgroundColor: "#FFFFFF" },
            ]}
          >
            <Text style={styles.scoreTitle}>Electrical</Text>
            <Text style={styles.scoreValue}>
              {calculateScore(data, AC_ELECTRICAL_FIELDS)}%
            </Text>
          </View>
        </View>

        {/* ----- Section: Body & Paint ----- */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconWrap}>
              <View style={styles.iconWrap}>{PDF_ICONS.car}</View>
            </View>
            <Text style={styles.sectionTitle}>Body & Paint Condition</Text>
          </View>

          {BODY_FIELDS.map((f) => (
            <View style={styles.fieldRow} key={f}>
              <Text style={styles.fieldLabel}>{formatLabel(f)}</Text>
              <Text style={styles.fieldValue}>{data[f] || "—"}</Text>
            </View>
          ))}
        </View>

        {/* ----- Section: Exterior Components ----- */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
             <View style={styles.iconWrap}>{PDF_ICONS.scan}</View>
            <Text style={styles.sectionTitle}>Exterior Components</Text>
          </View>

          {EXTERIOR_FIELDS.map((f) => (
            <View style={styles.fieldRow} key={f}>
              <Text style={styles.fieldLabel}>{formatLabel(f)}</Text>
              <Text style={styles.fieldValue}>{data[f] || "—"}</Text>
            </View>
          ))}
        </View>

        {/* ----- Section: Engine & Mechanical ----- */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
  <View style={styles.iconWrap}>{PDF_ICONS.wrench}</View>
            <Text style={styles.sectionTitle}>Engine & Mechanical</Text>
          </View>

          {ENGINE_FIELDS.map((f) => (
            <View style={styles.fieldRow} key={f}>
              <Text style={styles.fieldLabel}>{formatLabel(f)}</Text>
              <Text style={styles.fieldValue}>{data[f] || "—"}</Text>
            </View>
          ))}
        </View>

        {/* ----- Section: AC & Electrical ----- */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
  <View style={styles.iconWrap}>{PDF_ICONS.fan}</View>
            <Text style={styles.sectionTitle}>AC & Electrical</Text>
          </View>

          {AC_ELECTRICAL_FIELDS.map((f) => (
            <View style={styles.fieldRow} key={f}>
              <Text style={styles.fieldLabel}>{formatLabel(f)}</Text>
              <Text style={styles.fieldValue}>{data[f] || "—"}</Text>
            </View>
          ))}
        </View>

        {/* ----- Section: Glass & Mirrors ----- */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
             <View style={styles.iconWrap}>{PDF_ICONS.window}</View>
            <Text style={styles.sectionTitle}>Glass & Mirrors</Text>
          </View>

          {GLASS_FIELDS.map((f) => (
            <View style={styles.fieldRow} key={f}>
              <Text style={styles.fieldLabel}>{formatLabel(f)}</Text>
              <Text style={styles.fieldValue}>{data[f] || "—"}</Text>
            </View>
          ))}
        </View>

        {/* ----- Section: Other / Observations ----- */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
              <View style={styles.iconWrap}>{PDF_ICONS.clipboard}</View>
            <Text style={styles.sectionTitle}>Other / Observations</Text>
          </View>

          {OTHER_FIELDS.map((f) => (
            <View style={styles.fieldRow} key={f}>
              <Text style={styles.fieldLabel}>{formatLabel(f)}</Text>
              <Text style={styles.fieldValue}>{data[f] || "—"}</Text>
            </View>
          ))}
        </View>

        {/* ----- Extra dynamic fields not in pre-defined lists ----- */}
        {extraFields.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
               <View style={styles.iconWrap}>{PDF_ICONS.clipboard}</View>
              <Text style={styles.sectionTitle}>All Other Fields</Text>
            </View>

            {extraFields.map((k) => (
              <View style={styles.fieldRow} key={k}>
                <Text style={styles.fieldLabel}>{formatLabel(k)}</Text>
                <Text style={styles.fieldValue}>
                  {typeof data[k] === "object" ? JSON.stringify(data[k]) : data[k] || "—"}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* PHOTOS (grid) */}
        {photos.length > 0 && (
<View style={{ marginTop: 8 }}>
  <View style={styles.sectionHeader}>
     <View style={styles.iconWrap}>{PDF_ICONS.camera}</View>
    <Text style={styles.sectionTitle}>Vehicle Photos</Text>
  </View>

  <View style={styles.imageGrid}>
    {photos.slice(0, 12).map((p, i) => (
      <Image
        key={i}
        style={styles.photo}
        src={
          p.base64
            ? `data:${p.mimeType || "image/jpeg"};base64,${p.base64}`
            : p.uri || p.src
        }
      />
    ))}
  </View>
</View>
        )}

        {/* Footer */}
        <Text style={styles.footer}>
          Generated by {data.company_name || "Your Company"} • Contact:{" "}
          {data.company_contact || "—"} • Report generated on: {new Date().toLocaleDateString()}
        </Text>
      </Page>
    </Document>
  );
};

export default ReportPDFPremiumFull;
