const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const inspectionRoutes = require('./routes/inspectionRoutes');
const inspectionDetailRoutes = require('./routes/inspectionDetailRoutes');
require('dotenv').config();

const app = express();

// Create uploads folder if not exists (ROOT LEVEL)
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Serve static uploads folder
app.use('/uploads', express.static(uploadDir));

// Routes
app.use('/api/inspections', inspectionRoutes);
app.use('/api/inspection-details', inspectionDetailRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
  console.log(`Photos served from: http://localhost:${PORT}/uploads/<filename>`);
});
