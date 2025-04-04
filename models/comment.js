const { Model, DataTypes} = require('sequelize')

class Comment extends Model {
    static init(sequelize) {
        return super.init({
            playlistName: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            comment: {
                type: DataTypes.STRING(200),
                allowNull: false
            }
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'Comment',
            tableName: 'comments',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci'
        });

    }

    static associate(models) {
        models.Comment.belongsTo(models.User, { foreignKey: 'user_id', targetKey: 'uid' });
        models.Comment.belongsTo(models.Playlist, { foreignKey: 'playlistName', targetKey: 'playlistName' });
    }
}

module.exports = Comment;