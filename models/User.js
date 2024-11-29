const mongoose = require("mongoose");
const Schema = mongoose.Schema; // Importamos el constructor de esquemas de mongoose

// Creamos un nuevo esquema con el constructor de esquemas
const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" }, // Añadimos un campo role con un valor por defecto de "user" y que solo puede ser "user" o "admin"
});

module.exports = mongoose.model("User", userSchema); // Exportamos el modelo de usuario
