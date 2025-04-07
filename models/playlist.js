const { DataTypes, Model } = require('sequelize');

class Playlist extends Model {
    static init(sequelize) {
        return super.init({
            music_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            playlistName: {
                type: DataTypes.STRING(50),
                allowNull: false
            },
        }, {
            sequelize,
            timestamps: true,
            modelName: 'Playlist',
            tableName: 'playlists',
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci'
        })
    }

    static associate(models) {
        models.Playlist.belongsTo(models.User, { foreignKey: 'user_id', targetKey: 'uid', onDelete: 'CASCADE' })
        models.Playlist.belongsTo(models.Music, { foreignKey: 'music_id', targetKey: 'id', onDelete: 'CASCADE' })
    }
}

module.exports = Playlist;