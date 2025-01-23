//Archivo: src/models/orden_mysql.js
const { Sequelize, DataTypes } = require('sequelize');

// Conectar a la base de datos MySQL
const sequelize = new Sequelize('ordenesdb', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false, // Desactivar el logging SQL si no es necesario
});

// Definir el modelo de la tabla Orden
const Orden = sequelize.define('Orden', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true, // Definir como clave primaria
    autoIncrement: true, // Auto incrementa el valor del id
  },
  identificador: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  empresa: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  responsable: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  problematica: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  servicios_realizados: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  hora_inicio: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  hora_termino: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  nivel_satisfaccion: {
    type: DataTypes.ENUM('Malo', 'Regular', 'Bueno', 'Excelente'),
    allowNull: false,
  },
  problema_solucionado: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  nombre_encargado: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  nombre_cliente: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  telefono_cliente: {
    type: DataTypes.STRING(10), // Asumiendo que el teléfono tiene 10 dígitos
    allowNull: true,
  },
  foto_inicio: {
    type: DataTypes.STRING, // Asumiendo que se guarda el nombre o ruta del archivo
    allowNull: true,
  },
  foto_fin: {
    type: DataTypes.STRING, // Asumiendo que se guarda el nombre o ruta del archivo
    allowNull: true,
  },
});

// Sincronizar el modelo con la base de datos
sequelize.sync({ alter: true })
  .then(() => console.log('Modelo de Orden sincronizado con la base de datos'))
  .catch((err) => console.error('Error al sincronizar el modelo:', err));

module.exports = Orden;
