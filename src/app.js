const express = require("express");

const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(helmet());

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100, 
  message: { 
    success: false, 
    message: "Too many requests, please try again later" 
  }
});

app.use("/api", apiLimiter);

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 5, 
  message: { 
    success: false, 
    message: "Too many login attempts, please try again after 15 minutes" 
  }
});

app.use("/api/auth/login", loginLimiter);

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

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);


app.use(notFound);

app.use(errorHandler);

module.exports = app;