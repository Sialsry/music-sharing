const { Model, DataTypes} = require('sequelize')

class Like extends Model {
    static init(sequelize) {
        return super.init({
            music_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        }, {
            sequelize,
            timestamps: true,
            modelName: 'Like',
            tableName: 'likes',
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci'
        })
    }

    static associate(models) {
        models.Like.belongsTo(models.User, { foreignKey: 'user_id', targetKey: 'uid', onDelete: 'CASCADE' })
        models.Like.belongsTo(models.Music, { foreignKey: 'music_id', targetKey: 'id', onDelete: 'CASCADE' })
    }
}

module.exports = Like;