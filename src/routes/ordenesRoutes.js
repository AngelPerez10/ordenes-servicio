//Archivo: src/routes/ordenesRoutes.js
const express = require('express');
const router = express.Router();
const ordenesController = require('../controllers/ordenesController');
const Orden = require('../models/orden_mysql'); // Importa el modelo

// Importar middleware de Multer para manejar archivos
const upload = ordenesController.uploadFiles;

// Ruta para crear una nueva orden
router.post('/ordenes', upload, ordenesController.crearOrden);

// Ruta para mostrar todas las órdenes
router.get('/ordenes', async (req, res) => {
  try {
    const ordenes = await Orden.findAll(); // Obtiene todas las órdenes desde la base de datos
    res.render('crud', { ordenes }); // Renderiza la vista 'crud' con las órdenes
  } catch (err) {
    console.error('Error al obtener las órdenes:', err);
    res.status(500).send('Error al obtener las órdenes');
  }
});

// Ruta para crear una nueva orden
router.post('/ordenes', async (req, res) => {
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
    await Orden.create({
      identificador,
      empresa,
      responsable,
      problematica,
      servicios_realizados,
      fecha,
      hora_inicio,
      hora_termino,
      nivel_satisfaccion,
      problema_solucionado: problema_solucionado === 'on', // Convertir el checkbox en booleano
      nombre_encargado,
      nombre_cliente,
      firma_cliente,
      telefono_cliente,
      foto_inicio,
      foto_fin
    });
    res.redirect('/ordenes'); // Redirigir al listado de órdenes
  } catch (err) {
    console.error('Error al guardar la orden:', err);
    res.status(500).send('Error al guardar la orden');
  }
});

// Ruta para eliminar una orden
router.post('/ordenes/delete/:id', async (req, res) => {
  try {
    await Orden.destroy({
      where: { id: req.params.id },
    });
    res.redirect('/ordenes');
  } catch (err) {
    console.error('Error al eliminar la orden:', err);
    res.status(500).send('Error al eliminar la orden');
  }
});

module.exports = router;
