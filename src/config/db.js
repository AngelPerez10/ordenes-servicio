// src/config/db.js
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/ordenesDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
  console.log('Conexión a MongoDB exitosa');
});

mongoose.connection.on('error', (err) => {
  console.log('Error de conexión a MongoDB: ' + err);
});

module.exports = mongoose;
