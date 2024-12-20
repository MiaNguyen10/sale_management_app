const express = require("express");
const app = express();
const authRoutes = require("./routes/authRoutes");
const organizationRoutes = require("./routes/organizationRoutes");
const productRoutes = require("./routes/productRoutes");
const discountRoutes = require("./routes/discountRoutes");
const authMiddleware = require("./middlewares/authMiddleware");

//middleware to parse JSON data
app.use(express.json());

//Authenticate routes
app.use("/api/auth", authRoutes);

//Organizations endpoint
app.use("/api/organizations", organizationRoutes);

//Products endpoint
app.use("/api/products", productRoutes);

//Discounts endpoint
app.use("/api/discounts", discountRoutes);

// Example of a protected route
/*
const protectedRoutes = require('./routes/protectedRoutes');
app.use('/api/protected', authMiddleware, protectedRoutes);
*/

//handle 404 errors
app.use((req, res) => {
  res.status(404).json({ message: "Resource not found" });
});

//global error handler middleware
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

module.exports = app;
