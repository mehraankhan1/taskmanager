const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const foundItemRoutes = require("./routes/foundItemRoutes");
const path = require("path");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Serve uploaded photos
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));
app.use("/api/lost", require("./routes/lostItemRoutes"));
app.use("/api/found", foundItemRoutes);

// Connect to DB and start server if run directly
if (require.main === module) {
  connectDB();
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Export the app object for testing
module.exports = app;
