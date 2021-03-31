const {conn} = require('./connect.js')
const answers = (conn, DataTypes) => {
    const Answers = conn.define('answers', {
        answer: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        score: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        questionid:{
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        userid:{
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        }
    });
    Answers.associate = models => {
        Answers.belongsTo(models.Questions, {
            foreignKey: 'questionid',
            targetKey: 'id'
        }),
            Answers.belongsTo(models.Users, {
                foreignKey: 'userid',
                targetKey: 'id'
            })
    }
    return Answers
}
module.exports = answers