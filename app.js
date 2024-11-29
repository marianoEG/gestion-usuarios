const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes"); // Importar rutas
const logger = require("./utils/logger");

const app = express();
app.use(express.json());

// Configurar la conexión a MongoDB
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true, // Configuración necesaria para evitar warnings
        useUnifiedTopology: true, // Configuración necesaria para evitar warnings
    })
    .then(() => logger.info("Connected to MongoDB successfully"))
    .catch((err) => logger.error("Error connecting to MongoDB:", err));

// Middleware para registrar solicitudes
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.originalUrl}`);
    next();
});

// Usar las rutas
app.use("/api", userRoutes);

// Middleware para manejar errores
app.use((err, req, res, next) => {
    logger.error(`Error: ${err.message}`);
    res.status(err.status || 500).json({
        error: err.message || "Internal Server Error",
    });
});

module.exports = app;
