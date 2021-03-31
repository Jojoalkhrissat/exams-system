const {Sequelize,Model,DataTypes} = require('sequelize');
const conn = new Sequelize('DATABASE NAME', 'DATABASE USER', 'DATABASE PASSWORD', {
    host: 'DATABASE HOST',
    dialect: 'DATABASE DIALECT',
    operatorsAliases:false,
    define:{
        timestamps:false
    }
});
try {
    conn.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}
module.exports={conn}