// Importar las dependencias necesarias
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const mysql = require("mysql2");
const bodyParser = require("body-parser");

// Crear la aplicación Express
const app = express();
app.use(express.static("public"));

// Crear la carpeta 'uploads' si no existe
const uploadDir = path.join(__dirname, "public", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("Carpeta uploads creada.");
}

// Configuración de almacenamiento para Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Carpeta donde se guardarán los archivos
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// Configuración de Multer para el manejo de archivos
const upload = multer({ storage: storage });

// Conexión a la base de datos (configura tu base de datos correctamente)
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
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Ruta principal (GET) para mostrar la lista de órdenes
app.get("/", (req, res) => {
  db.query("SELECT * FROM ordenes", (err, result) => {
    if (err) {
      console.error("Error al obtener las órdenes:", err);
      res.status(500).send("Error al obtener las órdenes.");
    } else {
      //res.render("formulario", { ordenes: result }); //Renderizar formulario.ejs
      res.render("crud", { ordenes: result }); // Renderizar crud.ejs
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
      nombre_encargado, // Nuevo campo
      nombre_cliente, // Nuevo campo
    } = req.body;

    const problemaSolucionado = problema_solucionado === "true" ? 1 : 0;

    // Verificar si se han subido los archivos
    const foto_inicio = req.files["foto_inicio"]
      ? req.files["foto_inicio"][0].filename
      : null;
    const foto_fin = req.files["foto_fin"]
      ? req.files["foto_fin"][0].filename
      : null;

    // Guardar en la base de datos
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
        foto_fin
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


// Iniciar el servidor
app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
