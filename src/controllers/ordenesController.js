// Archivo: src/controllers/ordenesController.js
const Orden = require("../models/ordenModel"); // Importa el modelo de la orden

// Listar todas las órdenes
exports.listarOrdenes = async (req, res) => {
  try {
    const ordenes = await Orden.find(); // Encuentra todas las órdenes en la base de datos
    res.status(200).json(ordenes);
  } catch (error) {
    res.status(500).json({ message: "Error al listar órdenes", error });
  }
};

// Crear una nueva orden
exports.crearOrden = async (req, res) => {
  try {
    const nuevaOrden = new Orden(req.body); // Crea una nueva orden con los datos del cuerpo de la petición
    const ordenGuardada = await nuevaOrden.save(); // Guarda la orden en la base de datos
    res.status(201).json(ordenGuardada);
  } catch (error) {
    res.status(500).json({ message: "Error al crear la orden", error });
  }
};

// Obtener una orden específica por ID
exports.obtenerOrden = async (req, res) => {
  try {
    const { id } = req.params;
    const orden = await Orden.findById(id); // Busca la orden por su ID
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
    const ordenActualizada = await Orden.findByIdAndUpdate(id, req.body, { new: true }); // Actualiza la orden
    if (!ordenActualizada) return res.status(404).json({ message: "Orden no encontrada" });
    res.status(200).json(ordenActualizada);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la orden", error });
  }
};

// Eliminar una orden por ID
exports.eliminarOrden = async (req, res) => {
  try {
    const { id } = req.params;
    const ordenEliminada = await Orden.findByIdAndDelete(id); // Elimina la orden por su ID
    if (!ordenEliminada) return res.status(404).json({ message: "Orden no encontrada" });
    res.status(200).json({ message: "Orden eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la orden", error });
  }
};
