const { Model, DataTypes} = require('sequelize')

class User extends Model {
    static init(sequelize) {
        return super.init({
            uid : {
                type : DataTypes.STRING(100),
                primaryKey : true
            },
            nickname: {
                type: DataTypes.STRING(20),
                allowNull: false,
                unique: true
            },
            profileImg: {
                type: DataTypes.STRING,
                allowNull: true
            }
        }, {
            sequelize,
            timestamps: true,
            modelName: 'User',
            tableName: 'users',
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci'
        })
    }

    static associate(models) {
        models.User.hasMany(models.Like, { foreignKey: 'user_id', sourceKey: 'uid', onDelete: 'CASCADE' })
        models.User.hasMany(models.Playlist, { foreignKey: 'user_id', sourceKey: 'uid', onDelete: 'CASCADE' })
        models.User.hasMany(models.Comment, { foreignKey: 'user_id', sourceKey: 'uid', onDelete: 'CASCADE' })
        models.User.hasMany(models.Live, { foreignKey: 'user_id', sourceKey: 'uid', onDelete: 'CASCADE' })
    }
}

module.exports = User;
    
