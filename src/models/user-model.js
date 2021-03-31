const users = (conn, DataTypes) => {
const Users =conn.define('users',{
    id:{
        type: DataTypes.INTEGER(20),
        primaryKey: true,
        autoIncrement: true
    },
   firstname:{
       type: DataTypes.STRING(20),
       allowNull: false
   },
   lastname: {
       type: DataTypes.STRING(20),
       allowNull: false
   },
   phonenumber: {
       type: DataTypes.STRING(20),
       unique: true,
       allowNull: true
   },
   email: {
       type: DataTypes.STRING(50),
       unique: true,
       allowNull: false,
       is: /^\S+@\S+\.\S+$/i
   }, password: {
       type: DataTypes.STRING(64)
   }
   
});
Users.associate = models => {
    Users.hasMany(models.Attempts, {
        onDelete: 'CASCADE'
    });
    Users.hasMany(models.Answers, {
        onDelete: 'CASCADE'
    })
}
return Users
}
module.exports=users