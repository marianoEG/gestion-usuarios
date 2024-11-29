// Middleware para autorizar a los usuarios a acceder a ciertas rutas
const authorize = (roles = []) => {
    // Creamos un middleware que recibe un array de roles
    if (typeof roles === "string") {
        // Si solo se ha pasado un rol
        roles = [roles]; // Convertimos el rol en un array
    }

    return (req, res, next) => {
        // Devolvemos un middleware que recibe la petición, la respuesta y la siguiente función middleware
        if (!roles.includes(req.user.role)) {
            // Si el rol del usuario no está en el array de roles permitidos
            return res.status(403).json({ message: "Unauthorized" }); // Respondemos con un error 403
        }
        next(); // Llamamos a la siguiente función middleware
    };
};

module.exports = authorize; // Exportamos el middleware
