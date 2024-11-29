# **Gestión de Usuarios con Node.js, Express y MongoDB**

Este proyecto es una **API REST** desarrollada con Node.js, Express y MongoDB para la gestión de usuarios. Incluye funcionalidades como autenticación, registro de usuarios, actualización de información, cambio de contraseñas, eliminación de usuarios y paginación. Además, implementa un sistema de logs para monitoreo y depuración.

---

## **Características**

1. **Autenticación y Autorización**:
   - Autenticación mediante **JSON Web Tokens (JWT)**.
   - Rutas protegidas según roles (usuario, administrador).

2. **Gestión de Usuarios**:
   - Registro de usuarios.
   - Actualización de información (nombre, correo, etc.).
   - Cambio de contraseña.
   - Eliminación de usuarios (autorización por roles).
   - Listado de usuarios con **paginación** y **búsqueda**.

3. **Validación**:
   - Validaciones avanzadas con **Joi** para garantizar datos correctos.

4. **Logs**:
   - Sistema de logs con **Winston** para monitorear eventos importantes (solicitudes, errores, conexión a la base de datos).

5. **Arquitectura Modular**:
   - Código organizado en modelos, rutas, controladores y middlewares para facilitar la escalabilidad.

---

## **Tecnologías Utilizadas**

- **Backend**: Node.js con Express.
- **Base de Datos**: MongoDB.
- **Autenticación**: JWT.
- **Validación de datos**: Joi.
- **Logs**: Winston.

---

## **Requisitos Previos**

Antes de comenzar, asegúrate de tener instalados los siguientes programas:

- [Node.js](https://nodejs.org/) (v16 o superior)
- [MongoDB](https://www.mongodb.com/) (local o en la nube)
- [Git](https://git-scm.com/)

---

## **Instalación**

Sigue estos pasos para clonar y ejecutar el proyecto:

1. **Clonar el Repositorio**:
   ```bash
   git clone https://github.com/tu-usuario/tu-repositorio.git
   cd tu-repositorio
   ```

2. **Instalar Dependencias**:
   ```bash
   npm install
   ```

3. **Configurar el Archivo `.env`**:
   Crea un archivo `.env` en la raíz del proyecto y agrega las siguientes variables:
   ```env
   PORT=3000
   MONGO_URI=mongodb://127.0.0.1:27017/auth-practica
   JWT_SECRET=tu_clave_secreta
   ```

4. **Iniciar la Aplicación**:
   ```bash
   npm start
   ```
   La API estará disponible en: `http://localhost:3000`.

---

## **Uso de la API**

### **Rutas Principales**

1. **Autenticación**:
   - **POST `/api/auth/login`**: Inicia sesión y obtiene un token JWT.
   - **POST `/api/auth/register`**: Registra un nuevo usuario.

2. **Gestión de Usuarios**:
   - **GET `/api/users?page=1&limit=10`**: Lista de usuarios con paginación.
   - **PUT `/api/users/:id`**: Actualiza información de un usuario (requiere autenticación).
   - **PUT `/api/users/change-password`**: Cambia la contraseña del usuario autenticado.
   - **DELETE `/api/users/:id`**: Elimina un usuario (requiere rol de administrador).

3. **Búsqueda de Usuarios**:
   - **GET `/api/users?search=<query>`**: Filtra usuarios por nombre o correo.

---

## **Estructura del Proyecto**

```plaintext
project/
│
├── models/         # Modelos de Mongoose
│   └── User.js     # Esquema de usuario
│
├── routes/         # Rutas de la API
│   └── userRoutes.js
│
├── controllers/    # Lógica de los controladores
│   └── userController.js
│
├── middlewares/    # Middlewares personalizados
│   └── auth.js     # Middleware para autenticación
│
├── utils/          # Utilidades y configuración
│   └── logger.js   # Configuración de Winston
│
├── app.js          # Configuración principal de Express
├── index.js        # Punto de entrada del servidor
├── package.json    # Configuración del proyecto
└── .env.example    # Ejemplo de configuración de variables de entorno
```

---

## **Logs**

El sistema de logs registra eventos importantes, incluyendo:

- Conexiones a la base de datos.
- Solicitudes HTTP.
- Errores de la aplicación.

Logs disponibles en:
- **Consola**: Colores y formato legible.
- **Archivo**: `logs/app.log` (división por días opcional).

---

