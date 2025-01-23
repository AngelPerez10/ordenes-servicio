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


// Ruta para obtener los datos de la orden que se desea editar (GET)
router.get('/ordenes/:id/editar', async (req, res) => {
  try {
    const orden = await Orden.findByPk(req.params.id); // Obtener la orden desde la base de datos
    if (!orden) {
      return res.status(404).send('Orden no encontrada');
    }
    res.render('editOrder', { orden }); // Renderizar la vista con los datos de la orden
  } catch (err) {
    console.error('Error al obtener la orden:', err);
    res.status(500).send('Error al obtener la orden');
  }
});

// Ruta para actualizar una orden existente (POST)
router.post('/ordenes/:id/editar', upload, async (req, res) => {
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
    const orden = await Orden.findByPk(req.params.id);
    if (!orden) {
      return res.status(404).send('Orden no encontrada');
    }

    // Si se subieron nuevas fotos, actualizar las rutas
    const fotoInicio = req.files && req.files.foto_inicio ? req.files.foto_inicio[0].filename : foto_inicio;
    const fotoFin = req.files && req.files.foto_fin ? req.files.foto_fin[0].filename : foto_fin;

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
      foto_fin: fotoFin
    });

    res.redirect('/ordenes'); // Redirigir al listado de órdenes
  } catch (err) {
    console.error('Error al actualizar la orden:', err);
    res.status(500).send('Error al actualizar la orden');
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
