const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "E-commerce API is running"
  });
});

const productsRoutes = require("./routes/productsRoutes");
app.use("/api/products", productsRoutes);

const categoriesRoutes = require("./routes/categoriesRoutes");
app.use("/api/categories", categoriesRoutes);

const usersRoutes = require("./routes/usersRoutes");
app.use("/api/users", usersRoutes); 


app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found"
  });
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(error.status || 500).json({
    success: false,
    message: error.message || "Internal server error"
  });
});

module.exports = app;