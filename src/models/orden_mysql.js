const { Sequelize, DataTypes } = require('sequelize');

// Conectar a la base de datos MySQL
const sequelize = new Sequelize('ordenesdb', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false, // Desactivar el logging de SQL si no es necesario
});

// Definir el modelo
const Orden = sequelize.define('Orden', {
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
    type: DataTypes.STRING,
    allowNull: true,
  },
  problema_solucionado: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  nombre_cliente: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  firma_cliente: {
    type: DataTypes.STRING, // Asumiendo que la firma se guarda en base64
    allowNull: true,
  },
});

// Sincronizar el modelo con la base de datos
sequelize.sync()
  .then(() => console.log('Modelo de orden sincronizado con la base de datos'))
  .catch((err) => console.error('Error al sincronizar el modelo:', err));

module.exports = Orden;
