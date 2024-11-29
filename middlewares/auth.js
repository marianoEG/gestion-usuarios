const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

const authenticateToken = (req, res, next) => {
    // Creamos un middleware para autenticar el token
    const token = req.headers["authorization"]; // Extraemos el token de las cabeceras de la petición
    if (!token) {
        // Si no se ha enviado el token

        return res.status(401).json({ message: "Token required" }); // Respondemos con un error
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        // Verificamos el token con la clave secreta
        if (err) {
            // Si hay un error
            return res.status(403).json({ message: "Invalid token" }); // Respondemos con un error
        }

        req.user = user; // Añadimos el usuario al objeto req

        next(); // Llamamos a la siguiente función
    });
};

module.exports = authenticateToken; // Exportamos el middleware
