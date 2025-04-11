const { Model, DataTypes } = require('sequelize');

class Playlist extends Model {
    static init(sequelize) {
        return super.init({
            playlistName: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            music_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            isLive: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Playlist',
            tableName: 'playlists',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
            indexes: [
                { 
                    unique: true,
                    fields: ['playlistName', 'music_id']
                }
            ]
        });
    }
    
    static associate(models) {
        models.Playlist.belongsTo(models.User, { foreignKey: 'user_id', targetKey: 'uid' });
        models.Playlist.belongsTo(models.Music, { foreignKey: 'music_id', targetKey: 'id' });
    }
}

module.exports = Playlist;
