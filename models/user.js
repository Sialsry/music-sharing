const { Model, DataTypes} = require('sequelize')

class User extends Model {
    static init (sequelize) {
        return super.init({
            uid : {
                type : DataTypes.STRING(100),
                primaryKey : true,
            },
            nickName : {
                type : DataTypes.STRING(200),
                allowNull : false
            },
            userimage : {
              type : DataTypes.STRING(200),
              allowNull : false 
            }
        },{
            sequelize,
            timestamps : true,
            underscored : false,
            modelName : 'User',
            tableName : 'users',
            paranoid : false, 
            charset : 'utf8mb4',
            collate : 'utf8mb4_general_ci'
        }); // 테이블의 속성과 필드명과 필드 속성
    }
        static associate (models) {
            models.User.hasMany(models.Playlist, {foreignKey: "user_id", sourceKey : "uid"});
            models.User.hasMany(models.Like, {foreignKey: "user_id", sourceKey : "uid"});
            models.User.hasMany(models.Live, {foreignKey: "user_id", sourceKey : "uid"});
            models.User.hasMany(models.Comment, {foreignKey: "user_id", sourceKey : "uid"});
        }
}

module.exports = User;