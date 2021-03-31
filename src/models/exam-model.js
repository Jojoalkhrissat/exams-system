const {conn} = require('./connect.js')
const exams = (conn, DataTypes) => {
    const Exams = conn.define('exams', {
         id: {
                type: DataTypes.UUID,
                primaryKey: true
        },
        title: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        duration: {
            type: DataTypes.INTEGER(5),
            allowNull: false
        },
        description: {
            type: DataTypes.STRING(350),
            allowNull: true
        }
    });
    Exams.associate = models => {
        Exams.hasMany(models.Attempts, {
            onDelete: 'CASCADE'
        }),
         Exams.hasMany(models.Questions, {
             onDelete: 'CASCADE'
         })
    }
    return Exams
}
module.exports = exams