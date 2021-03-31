const {Sequelize}=require('sequelize')
const {conn} = require('./connect.js')
const attempts = (conn, DataTypes) => {
    const Attempts = conn.define('attempts', {
        attemptdate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            primaryKey: true
        },
        starttime: {
            type: DataTypes.DATE,
            allowNull: true
        },
        status: {
            type: DataTypes.STRING(20),
            allowNull: false,
            defaultValue:'NOT STARTED'
        },
        examid:{
            type: DataTypes.STRING(50),
            primaryKey: true
        },
        userid: {
            type: DataTypes.INTEGER(10),
            primaryKey: true
        }
    });
    Attempts.associate = models => {
        Attempts.belongsTo(models.Exams, {
            foreignKey: 'examid',
            targetKey: 'id'
        });
            Attempts.belongsTo(models.Users, {
                foreignKey: 'userid',
                targetKey: 'id'
            });
    }
    return Attempts
}
module.exports = attempts