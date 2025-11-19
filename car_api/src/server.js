const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const inspectionRoutes = require('./routes/inspectionRoutes');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/inspections', inspectionRoutes);

// Create uploads folder if not exists
const fs = require('fs');
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
  console.log(`Photos will be at http://localhost:${PORT}/uploads/your-photo.jpg`);
});