const express = require('express');
const router = express.Router();
const Orden = require('../models/orden_mysql');

// Ruta para mostrar todas las órdenes
router.get('/ordenes', async (req, res) => {
  try {
    const ordenes = await Orden.findAll(); // Obtiene todas las órdenes desde la base de datos
    res.render('crud', { ordenes }); // Pasa las órdenes a la vista
  } catch (err) {
    console.error('Error al obtener las órdenes:', err);
    res.status(500).send('Error al obtener las órdenes');
  }
});

// Ruta para crear una nueva orden
router.post('/ordenes', async (req, res) => {
  const { empresa, responsable, problematica, servicios_realizados, fecha, hora_inicio, hora_termino, nivel_satisfaccion, problema_solucionado, nombre_cliente, firma_cliente } = req.body;

  try {
    await Orden.create({
      empresa,
      responsable,
      problematica,
      servicios_realizados,
      fecha,
      hora_inicio,
      hora_termino,
      nivel_satisfaccion,
      problema_solucionado: problema_solucionado === 'on', // Convertir el checkbox en booleano
      nombre_cliente,
      firma_cliente,
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
