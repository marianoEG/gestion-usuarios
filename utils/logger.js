const winston = require("winston");

const logger = winston.createLogger({
    level: "info", // Nivel de los mensajes a registrar
    format: winston.format.combine(
        // Combinamos varios formatos
        // Formato de los mensajes
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), // Añadimos la fecha y hora al mensaje
        winston.format.printf(
            // Definimos el formato del mensaje
            ({ timestamp, level, message }) =>
                `${timestamp} ${level.toLocaleUpperCase()}: ${message}`
        ) // Definimos el formato del mensaje
    ),
    transports: [
        new winston.transports.Console({
            // Añadimos un transporte para mostrar los mensajes por consola
            format: winston.format.colorize(), // Añadimos color a los mensajes de consola
        }),
        new winston.transports.File({ filename: "logs/app.log" }), // Añadimos un transporte para guardar los mensajes en un archivo
    ],
});

module.exports = logger; // Exportamos el módulo
