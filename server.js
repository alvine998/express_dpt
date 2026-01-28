const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const sequelize = require("./src/config/database");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4020;

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

// Swagger Config
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "BPJS Scrapper API",
      version: "1.0.0",
      description: "API for BPJS Scrapper Mobile Application",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: "Local server",
      },
      {
        url: `http://154.26.137.37:4020`,
        description: "Production Server",
      },
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "X-API-Key",
        },
      },
    },
    security: [
      {
        ApiKeyAuth: [],
      },
    ],
  },
  apis: [require("path").join(__dirname, "./src/routes/*.js")], // Path to the API docs
};

const swaggerSpecs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Routes
const userRoutes = require("./src/routes/users");
const batchRoutes = require("./src/routes/batches");
const sippRoutes = require("./src/routes/sipp");
const externalRoutes = require("./src/routes/external");
const sessionRoutes = require("./src/routes/session");
const predictRoutes = require("./src/routes/predict");
const usageRoutes = require("./src/routes/usage");

app.use("/api/users", userRoutes);
app.use("/api/batches", batchRoutes);
app.use("/api/sipp_history", sippRoutes);
app.use("/api/servicesjmo", externalRoutes);
app.use("/api/session_verify", sessionRoutes);
app.use("/api/usage", usageRoutes);
// Predict route without /api/ prefix as per spec
app.use("/predict", predictRoutes);

// Sync Database and Start Server
sequelize
  .sync({ alter: true }) // using alter to update tables if needed
  .then(() => {
    console.log("Database synced");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Swagger docs at http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((err) => {
    console.error("Failed to sync database:", err);
  });
