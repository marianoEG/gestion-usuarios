const User = require("../models/User"); // Importamos el modelo de usuario
const bcrypt = require("bcrypt"); // Importamos bcrypt para encriptar la contraseña
const jwt = require("jsonwebtoken"); // Importamos jsonwebtoken para generar tokens
const SECRET_KEY = process.env.SECRET_KEY; // Clave secreta para firmar los tokens
const Joi = require("joi"); // Importamos Joi para validar los datos
const { parse } = require("dotenv");

// Esquema de validación para registrar usuarios
const userSchema = Joi.object({
    username: Joi.string()
        .min(3)
        .message("Username must be at least 3 characters long")
        .required(), // Validamos que el username sea un string de al menos 3 caracteres
    password: Joi.string()
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/) // Validamos que el password contenga al menos una minúscula, una mayúscula, un número y tenga al menos 8 caracteres
        .message(
            "Password must contain at least one lowercase letter, one uppercase letter, one number, and be at least 8 characters long"
        )
        .required(), // Validamos que el password sea un string de al menos 8 caracteres
});

// Esquema de validación para actualizar usuarios
const updateUserSchema = Joi.object({
    username: Joi.string()
        .min(3)
        .message("Username must be at least 3 characters long")
        .optional(), // Campo opcional
    password: Joi.string()
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/) // Validamos que el password contenga al menos una minúscula, una mayúscula, un número y tenga al menos 8 caracteres
        .message(
            "Password must contain at least one lowercase letter, one uppercase letter, one number, and be at least 8 characters long"
        )
        .optional(), // Campo opcional
}).min(1); // Al menos un campo es necesario

// Esquema de paginación
const paginationSchema = Joi.object({
    page: Joi.number().integer().min(1).default(1), // Validamos que la página sea un número entero positivo
    limit: Joi.number().integer().min(1).max(100).default(10), // Validamos que el límite sea un número entero positivo entre 1 y 100
});

// Esquema para cambiar la contraseña
const changePasswordSchema = Joi.object({
    oldPassword: Joi.string().required(), // Validamos que la contraseña antigua sea un string y sea requerida
    newPassword: Joi.string()
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/) // Validamos que el password contenga al menos una minúscula, una mayúscula, un número y tenga al menos 8 caracteres
        .message(
            "Password must contain at least one lowercase letter, one uppercase letter, one number, and be at least 8 characters long"
        )
        .required(), // Validamos que la contraseña nueva sea un string de al menos 8 caracteres
});

// Listar todos los usuarios
exports.getUsers = async (req, res) => {
    const { error, value } = paginationSchema.validate(req.query); // Validamos los datos de la consulta. value contiene los datos validados.
    if (error) {
        // Si hay un error en la validación
        return res.status(400).json({ message: error.message }); // Respondemos con un error
    }

    const { page = 1, limit = 10 } = req.query; // Extraemos la página y el límite de la consulta

    try {
        const users = await User.find({}, { password: 0 }) // Buscamos todos los usuarios y excluimos la contraseña por motivos de seguridad
            .skip((page - 1) * limit) // Saltamos los documentos anteriores según la página y el límite
            .limit(parseInt(limit)); // Limitamos la cantidad de documentos a mostrar

        const total = await User.countDocuments(); // Contamos el total de documentos

        res.json({
            users, // Respondemos con los usuarios
            total, // Respondemos con el total de documentos
            page: parseInt(page), // Respondemos con la página actual
            totalPages: Math.ceil(total / limit), // Respondemos con el total de páginas
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Registrar un nuevo usuario
exports.registerUser = async (req, res) => {
    const { error } = userSchema.validate(req.body); // Validamos los datos del cuerpo de la petición
    if (error) {
        // Si hay un error en la validación
        return res.status(400).json({ message: error.message }); // Respondemos con un error
    }

    const { username, password } = req.body; // Extraemos el username y password del cuerpo de la petición

    if (!username || !password) {
        // Si el username o el password no se han enviado
        return res
            .status(400)
            .json({ message: "Username and password are required" }); // Respondemos con un error
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10); // Encriptamos la contraseña con bcrypt y un salt de 10
        const newUser = new User({ username, password: hashedPassword }); // Creamos un nuevo usuario con el username y la contraseña encriptada
        await newUser.save(); // Guardamos el nuevo usuario en la base de datos
        res.status(201).json(newUser); // Respondemos con el nuevo usuario
    } catch (error) {
        if (error.code === 11000) {
            // Si el error es un error de duplicado
            return res.status(400).json({ message: "Username already in use" }); // Respondemos con un error
        } else {
            res.status(400).json({ message: error.message });
        }
    }
};

// Iniciar sesión
exports.loginUser = async (req, res) => {
    const { username, password } = req.body; // Extraemos el username y password del cuerpo de la petición

    if (!username || !password) {
        // Si el username o el password no se han enviado
        return res
            .status(400)
            .json({ message: "Username and password are required" }); // Respondemos con un error
    }

    try {
        const user = await User.findOne({ username }); // Buscamos un usuario con el username proporcionado
        if (!user) {
            // Si no se ha encontrado el usuario
            return res
                .status(401)
                .json({ message: "Invalid username or password" }); // Respondemos con un error
        }

        const isPasswordValid = await bcrypt.compare(password, user.password); // Comparamos la contraseña proporcionada con la contraseña almacenada en la base de datos
        if (!isPasswordValid) {
            // Si la contraseña no es válida
            return res
                .status(401)
                .json({ message: "Invalid username or password" }); // Respondemos con un error
        }

        const token = jwt.sign(
            { id: user._id, username: user.username, role: user.role }, // Añadimos el id, el username y el rol del usuario al token
            SECRET_KEY,
            { expiresIn: "1h" }
        ); // Generamos un token con el id, el username del usuario y la clave secreta

        res.json({ message: "Login successful", token }); // Respondemos con un mensaje de éxito y el token generado
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Actualizar un usuario
exports.updateUser = async (req, res) => {
    const { id } = req.params; // Extraemos el id de los parámetros de la petición

    const { error } = updateUserSchema.validate(req.body); // Validamos los datos del cuerpo de la petición
    if (error) {
        // Si hay un error en la validación
        return res.status(400).json({ message: error.message }); // Respondemos con un error
    }

    const { username } = req.body; // Extraemos el username y el password del cuerpo de la petición

    try {
        const updateData = {};
        if (username) updateData.username = username; // Si se ha enviado el username, lo añadimos a los datos a actualizar

        const updatedUser = await User.findByIdAndUpdate(id, updateData, {
            new: true,
        }); // Buscamos y actualizamos el usuario por id. El parámetro { new: true } nos devuelve el usuario actualizado

        if (!updatedUser) {
            // Si no se ha encontrado el usuario
            return res.status(404).json({ message: "User not found" }); // Respondemos con un error
        }

        res.json(updatedUser); // Respondemos con el usuario actualizado
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Eliminar un usuario
exports.deleteUser = async (req, res) => {
    const { id } = req.params; // Extraemos el id de los parámetros de la petición

    try {
        const deletedUser = await User.findByIdAndDelete(id); // Buscamos y eliminamos el usuario por id

        if (!deletedUser) {
            // Si no se ha encontrado el usuario
            return res.status(404).json({ message: "User not found" }); // Respondemos con un error
        }

        res.json(deletedUser); // Respondemos con el usuario eliminado
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Buscar un usuario por rol o username
exports.searchUsers = async (req, res) => {
    const { username, role } = req.query; // Extraemos el username y el rol de la consulta

    try {
        const query = {};

        if (username) {
            query.username = new RegExp(username, "i"); // Buscamos usuarios que contengan el username proporcionado. La "i" al final de la expresión regular indica que la búsqueda no es sensible a mayúsculas y minúsculas
        }

        if (role) {
            query.role = role; // Buscamos usuarios con el rol proporcionado
        }

        const users = await User.find(query, { password: 0 }); // Buscamos usuarios que coincidan con la consulta y excluimos la contraseña por motivos de seguridad
        res.json(users); // Respondemos con los usuarios encontrados
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Cambiar contraseña
exports.changePassword = async (req, res) => {
    const { error } = changePasswordSchema.validate(req.body); // Validamos los datos del cuerpo de la petición
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    const { oldPassword, newPassword } = req.body; // Extraemos la contraseña antigua y la nueva del cuerpo de la petición

    try {
        const user = await User.findById(req.user.id); // Buscamos al usuario por id desde el token
        if (!user) {
            // Si no se ha encontrado el usuario
            return res.status(404).json({ message: "User not found" }); // Respondemos con un error
        }

        const isPasswordValid = await bcrypt.compare(
            oldPassword,
            user.password
        ); // Comparamos la contraseña antigua con la contraseña almacenada en la base de datos
        if (!isPasswordValid) {
            // Si la contraseña antigua no es válida
            return res.status(401).json({ message: "Invalid password" }); // Respondemos con un error
        }

        user.password = await bcrypt.hash(newPassword, 10); // Encriptamos la nueva contraseña con bcrypt y un salt de 10
        await user.save(); // Guardamos el usuario con la nueva contraseña en la base de datos

        res.json({ message: "Password changed successfully" }); // Respondemos con un mensaje de éxito
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
