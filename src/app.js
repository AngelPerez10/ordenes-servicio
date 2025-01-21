const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ordenesRoutes = require("./routes/ordenesRoutes"); // Importar las rutas

// Crear la aplicación de Express
const app = express();

// Middleware para parsear datos
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configurar motor de vistas
app.set("view engine", "ejs");
app.set("views", "./src/views"); // Ruta de las vistas

// Configurar archivos estáticos
app.use(express.static("public"));

// Conectar a MongoDB
mongoose
  .connect("mongodb://localhost:27017/ordenesDB", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Conectado a MongoDB"))
  .catch((err) => console.error("Error al conectar a MongoDB:", err));

// Rutas principales
app.use("/ordenes", ordenesRoutes); // Prefijo para las rutas relacionadas con órdenes

// Ruta base (inicio)
app.get("/", (req, res) => {
  res.send("Bienvenido a la API de Órdenes de Servicio");
});

// Iniciar servidor
const PORT = 3000; // Cambia este puerto si es necesario
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
