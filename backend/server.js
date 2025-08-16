// server.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const foundItemRoutes = require("./routes/foundItemRoutes");
const path = require("path");

// Load environment variables from .env
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded photos
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));
app.use("/api/lost", require("./routes/lostItemRoutes"));
app.use("/api/found", foundItemRoutes);

// Connect to MongoDB and start server if run directly
if (require.main === module) {
  connectDB();
  const PORT = process.env.PORT || 5001;

  // Listen on all interfaces so EC2 public IP can access it
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export app for testing
module.exports = app;
