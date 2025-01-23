// src/controllers/ordenesController.js

const Orden = require("../models/orden_mysql");
const multer = require("multer");

// Configuración de Multer para el manejo de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Carpeta donde se almacenan los archivos
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Nombre único para cada archivo
  },
});
const upload = multer({ storage });

// Función para crear una nueva orden
exports.crearOrden = async (req, res) => {
  try {
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
      nombre_encargado,
      nombre_cliente,
      telefono_cliente,
    } = req.body || {};

    // Asegúrate de que los campos requeridos no sean vacíos
    if (!identificador || !empresa || !responsable || !fecha || !hora_inicio || !hora_termino || !nivel_satisfaccion || !nombre_cliente || !telefono_cliente) {
      return res.status(400).send("Datos incompletos.");
    }

    const foto_inicio_path = req.files && req.files["foto_inicio"] ? req.files["foto_inicio"][0].filename : null;
    const foto_fin_path = req.files && req.files["foto_fin"] ? req.files["foto_fin"][0].filename : null;

    // Validar si foto_inicio y foto_fin tienen un valor correcto si no se han subido
    const nuevaOrden = await Orden.create({
      identificador,
      empresa,
      responsable,
      problematica,
      servicios_realizados,
      fecha,
      hora_inicio,
      hora_termino,
      nivel_satisfaccion,
      problema_solucionado: problema_solucionado === 'on', // Convertir checkbox en booleano
      nombre_encargado,
      nombre_cliente,
      telefono_cliente,
      foto_inicio: foto_inicio_path,
      foto_fin: foto_fin_path,
    });

    res.redirect("/ordenes"); // Redirige a la lista de órdenes después de crearla
  } catch (error) {
    console.error("Error al crear la orden:", error);
    res.status(500).send("Error al crear la orden.");
  }
};


// Obtener una orden específica por ID
exports.obtenerOrden = async (req, res) => {
  try {
    const { id } = req.params;
    const orden = await Orden.findByPk(id); // Busca la orden por su ID usando Sequelize
    if (!orden) return res.status(404).json({ message: "Orden no encontrada" });
    res.status(200).json(orden);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la orden", error });
  }
};

// Actualizar una orden por ID
exports.actualizarOrden = async (req, res) => {
  try {
    const { id } = req.params;
    const ordenActualizada = await Orden.update(req.body, {
      where: { id },
      returning: true,
      plain: true,
    });
    if (!ordenActualizada[1]) return res.status(404).json({ message: "Orden no encontrada" });
    res.status(200).json(ordenActualizada[1]);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la orden", error });
  }
};



// Función para actualizar una orden existente
exports.actualizarOrden = async (req, res) => {
  const { id } = req.params;
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
    nombre_encargado,
    nombre_cliente,
    telefono_cliente,
    foto_inicio,
    foto_fin
  } = req.body;

  try {
    // Buscar la orden a actualizar
    const orden = await Orden.findByPk(id);
    if (!orden) {
      return res.status(404).send('Orden no encontrada');
    }

    // Si se subieron nuevas fotos, asignar las rutas correctas
    const fotoInicio = req.files && req.files['foto_inicio'] ? req.files['foto_inicio'][0].filename : foto_inicio;
    const fotoFin = req.files && req.files['foto_fin'] ? req.files['foto_fin'][0].filename : foto_fin;

    // Actualizar la orden con los nuevos datos
    await orden.update({
      identificador,
      empresa,
      responsable,
      problematica,
      servicios_realizados,
      fecha,
      hora_inicio,
      hora_termino,
      nivel_satisfaccion,
      problema_solucionado: problema_solucionado === 'on',
      nombre_encargado,
      nombre_cliente,
      telefono_cliente,
      foto_inicio: fotoInicio,
      foto_fin: fotoFin,
    });

    // Redirigir a la lista de órdenes
    res.redirect("/ordenes");
  } catch (error) {
    console.error("Error al actualizar la orden:", error);
    res.status(500).send("Error al actualizar la orden.");
  }
};



// Eliminar una orden por ID
exports.eliminarOrden = async (req, res) => {
  try {
    const { id } = req.params;
    const ordenEliminada = await Orden.destroy({
      where: { id },
    });
    if (!ordenEliminada) return res.status(404).json({ message: "Orden no encontrada" });
    res.status(200).json({ message: "Orden eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la orden", error });
  }
};

// Middleware para manejar archivos
exports.uploadFiles = upload.fields([
  { name: "foto_inicio", maxCount: 1 },
  { name: "foto_fin", maxCount: 1 },
]);
