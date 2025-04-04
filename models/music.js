const { Model, DataTypes} = require('sequelize')

class Music extends Model {
    static init(sequelize) {
        return super.init({
            musicid: {
                type: DataTypes.INTEGER,
                autoIncrement : true,
                primaryKey: true
            },
            songName: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            songImg: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            musicResource: {
                type: DataTypes.STRING(200),
                allowNull: false
            },
            artist: {
                type: DataTypes.STRING(50),
                allowNull: false
            }
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'Music',
            tableName: 'musics',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci'
        });
    }

    static associate(models) {
        models.Music.hasMany(models.Like, { foreignKey: 'music_id', sourceKey: 'musicid' });
        models.Music.hasMany(models.Playlist, { foreignKey: 'music_id', sourceKey: 'musicid' });
    }
}

module.exports = Music;