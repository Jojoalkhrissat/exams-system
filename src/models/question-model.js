const questions = (conn, DataTypes) => {
    const Questions = conn.define('questions', {
        id: {
            type: DataTypes.INTEGER(20),
            primaryKey: true,
            autoIncrement: true
        },
        question: {
            type: DataTypes.STRING(250),
            allowNull: false
        },
        description: {
            type: DataTypes.STRING(300),
            allowNull: true
        },
        photo: {
            type: DataTypes.STRING(300),
            allowNull: true
        }
    });
    Questions.associate = models => {
        Questions.hasMany(models.Answers, {
                onDelete: 'CASCADE'
            }),
            Questions.belongsTo(models.Exams, {
                foreignKey: 'examid',
                targetKey: 'id'
            })
    }
    return Questions
}
module.exports = questions