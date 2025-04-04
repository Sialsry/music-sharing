const { Model, DataTypes} = require('sequelize')

class Playlist extends Model {
    static init(sequelize) {
        return super.init({
            playlistName: {
                type: DataTypes.STRING(100),
                primaryKey: true
            },
            music_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Playlist',
            tableName: 'playlists',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci'
        });
    }

    static associate(models) {
        models.Playlist.belongsTo(models.User, { foreignKey: 'user_id', targetKey: 'uid' });
        models.Playlist.belongsTo(models.Music, { foreignKey: 'music_id', targetKey: 'musicid' });
    }
}

module.exports = Playlist;
