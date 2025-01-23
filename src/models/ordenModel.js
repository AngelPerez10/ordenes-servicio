/*

ordenes-servicio/          # Carpeta raíz del proyecto
├── node_modules/          # Módulos de Node.js (generados por npm)
├── public/                # Archivos estáticos (CSS, JS del cliente, imágenes)
│   ├── css/               # Archivos CSS
│   ├── js/                # Scripts frontend
│   └── images/            # Imágenes
├── src/                   # Código fuente del proyecto
│   ├── config/            # Configuración de la base de datos y otras configuraciones
│   │   └── db.js          
│   ├── controllers/       # Lógica de negocio
│   │   └── ordenesController.js # Controlador para manejar órdenes
│   ├── models/            # Modelos de datos (esquemas de Mongoose)
│   │   └── orden_mysql.js       # Esquema de "Orden" para MongoDB
│   ├── routes/            # Rutas de la aplicación
│   │   └── ordenesRoutes.js # Rutas relacionadas con órdenes de servicio
│   ├── views/             # Plantillas de vistas (si usas un motor como EJS, Pug, etc.)│   │   
│   │   └── crud.ejs
│   └── app.js             # Archivo principal de la aplicación
├── .env                   # Variables de entorno
├── .gitignore             # Archivos a ignorar por Git
├── package.json           # Configuración del proyecto y dependencias
└── README.md              # Documentación del proyecto


*/

const mongoose = require("mongoose");

// Esquema para las órdenes de servicio
const ordenSchema = new mongoose.Schema({
  empresa: { type: String, required: true },
  responsable: { type: String, required: true },
  problematica: { type: String, required: true },
  servicios: { type: String, required: true },
  nivelSatisfaccion: { 
    type: String, 
    enum: ["Malo", "Regular", "Bueno", "Excelente"], 
    default: "Bueno" 
  },
  problemaSolucionado: { type: Boolean, default: false },
  fechaCreacion: { type: Date, default: Date.now },
});

// Crear el modelo de la orden
module.exports = mongoose.model("Orden", ordenSchema);

