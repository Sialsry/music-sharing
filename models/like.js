const { Model, DataTypes} = require('sequelize')

class Like extends Model {
    static init(sequelize) {
        return super.init({
            uid: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            music_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'Like',
            tableName: 'likes',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci'
        });
    }

    static associate(models) {
        models.Like.belongsTo(models.User, { foreignKey: 'user_id', targetKey: 'uid' });
        models.Like.belongsTo(models.Music, { foreignKey: 'music_id', targetKey: 'musicid' });
    }
}

module.exports = Like;