const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require("path");

// Explicitly load .env file from the current directory
dotenv.config();

// Connect to MongoDB Atlas
connectDB();

const app = express();

// Enable CORS for allowed origins
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      process.env.FRONTEND_URL,
    ].filter(Boolean), // Filter out undefined if FRONTEND_URL isn't set initially
    credentials: true,
  }),
);

app.use(express.json());

// API Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/payment", require("./routes/paymentRoutes"));
app.use("/api/analytics", require("./routes/analyticsRoutes"));

// Base route test
app.get("/", (req, res) => {
  res.send("ShopNest API is running on Vercel...");
});

// Export app for local running AND Vercel serverless functions
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running locally on port ${PORT}`));
}

module.exports = app;
