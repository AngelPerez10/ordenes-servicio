const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const ordenesRoutes = require("./routes/ordenesRoutes"); // Importar las rutas

// Crear la aplicación de Express
const app = express();

// Configuración de la conexión a MySQL (con Sequelize ya no es necesario usar mysql2 directamente)
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("ordenesdb", "root", "root", {
  host: "localhost",
  dialect: "mysql",
  logging: false, // Desactivar el logging SQL si no lo necesitas
});

// Middleware para parsear datos
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configurar motor de vistas
app.set("view engine", "ejs");
app.set("views", "./src/views"); // Ruta de las vistas

// Configurar archivos estáticos
app.use(express.static("public"));

// Rutas principales
app.use("/ordenes", ordenesRoutes); // Prefijo para las rutas relacionadas con órdenes

// Ruta principal para mostrar las órdenes
app.get("/", async (req, res) => {
  try {
    const [results] = await sequelize.query("SELECT * FROM ordenes"); // Usando Sequelize para obtener las órdenes
    res.render("crud", { ordenes: results });
  } catch (err) {
    console.error("Error al obtener las órdenes: ", err);
    res.status(500).send("Error al obtener las órdenes.");
  }
});

// Iniciar servidor
const PORT = 3000; // Cambia este puerto si es necesario
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
