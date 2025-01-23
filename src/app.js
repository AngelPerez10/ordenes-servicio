// Importar las dependencias necesarias
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const mysql = require("mysql2");
const bodyParser = require("body-parser");

// Crear la aplicación Express
const app = express();
app.use(express.static(path.join(__dirname, "../public"))); // Servir los archivos estáticos correctamente

// Ruta absoluta a la carpeta public/uploads (desde la raíz del proyecto)
const uploadsDir = path.join(__dirname, "../public/uploads");

// Crear la carpeta "public/uploads" si no existe
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configuración de almacenamiento para Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir); // Carpeta donde se guardarán los archivos
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

// Configuración de Multer para usar este almacenamiento
const upload = multer({ storage: storage });

// Conexión a la base de datos
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "ordenesdb",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Conectado a la base de datos.");
});

// Configuración de bodyParser para procesar datos POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configuración del motor de vistas
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Ruta principal (GET) para mostrar la lista de órdenes
app.get("/", (req, res) => {
  db.query("SELECT * FROM ordenes", (err, result) => {
    if (err) {
      console.error("Error al obtener las órdenes:", err);
      res.status(500).send("Error al obtener las órdenes.");
    } else {
      res.render("crud", { ordenes: result });
    }
  });
});

// Ruta para agregar nuevas órdenes (POST) con carga de archivos
app.post(
  "/ordenes",
  upload.fields([
    { name: "foto_inicio" },
    { name: "foto_fin" },
  ]),
  (req, res) => {
    const {
      identificador,
      empresa,
      responsable,
      problematica,
      servicios_realizados,
      fecha,
      hora_inicio,
      hora_termino,
      nivel_satisfaccion,
      problema_solucionado,
      telefono_cliente,
      nombre_encargado,
      nombre_cliente,
    } = req.body;

    const problemaSolucionado = problema_solucionado === "true" ? 1 : 0;

    const foto_inicio = req.files["foto_inicio"]
      ? req.files["foto_inicio"][0].filename
      : null;
    const foto_fin = req.files["foto_fin"]
      ? req.files["foto_fin"][0].filename
      : null;

    const query = `
    INSERT INTO ordenes (
      identificador, empresa, responsable, problematica, servicios_realizados, 
      fecha, hora_inicio, hora_termino, nivel_satisfaccion, problema_solucionado,
      telefono_cliente, nombre_encargado, nombre_cliente, foto_inicio, foto_fin
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(
      query,
      [
        identificador,
        empresa,
        responsable,
        problematica,
        servicios_realizados,
        fecha,
        hora_inicio,
        hora_termino,
        nivel_satisfaccion,
        problemaSolucionado,
        telefono_cliente,
        nombre_encargado,
        nombre_cliente,
        foto_inicio,
        foto_fin,
      ],
      (err, result) => {
        if (err) {
          console.error("Error al guardar la orden: ", err);
          res.status(500).send("Error al guardar la orden.");
        } else {
          res.redirect("/");
        }
      }
    );
  }
);

// Ruta para mostrar el formulario de edición de una orden
app.get("/ordenes/edit/:id", (req, res) => {
  const { id } = req.params;

  const query = "SELECT * FROM ordenes WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error al obtener los datos de la orden:", err);
      res.status(500).send("Error al obtener los datos de la orden.");
    } else if (result.length === 0) {
      res.status(404).send("Orden no encontrada.");
    } else {
      res.render("editOrder", { order: result[0] }); // Renderiza la vista con los datos de la orden
    }
  });
});


// Iniciar el servidor
app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
