const express = require("express");
const {
    getUsers,
    registerUser,
    updateUser,
    deleteUser,
    loginUser,
    searchUsers,
    changePassword,
} = require("../controllers/userController");
const authenticateToken = require("../middlewares/auth");
const authorize = require("../middlewares/authorize");

const router = express.Router();

// Rutas de prueba
router.get("/usersTest", getUsers); // Listar todos los usuarios

// Rutas
router.get("/users", authenticateToken, authorize("admin"), getUsers); // Listar todos los usuarios
router.get("/users/search", authenticateToken, authorize("admin"), searchUsers); // Buscar usuarios por username o rol
router.post("/register", registerUser); // Registrar un nuevo usuario
router.post("/login", loginUser); // Iniciar sesión
router.put("/users/change-password", authenticateToken, changePassword); // Cambiar la contraseña de un usuario
router.put("/users/:id", authenticateToken, updateUser); // Actualizar un usuario
router.delete("/users/:id", authenticateToken, authorize("admin"), deleteUser); // Eliminar un usuario

module.exports = router; // Exportamos las rutas
