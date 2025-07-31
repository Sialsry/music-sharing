const { Model, DataTypes } = require("sequelize");

class Music extends Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        songName: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        artist: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        songImg: {
          type: DataTypes.STRING(100),
          allowNull: true,
        },
        musicResource: {
          type: DataTypes.STRING(200),
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        modelName: "Music",
        tableName: "musics",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }

  static associate(models) {
    models.Music.hasMany(models.Like, {
      foreignKey: "music_id",
      sourceKey: "id",
      onDelete: "CASCADE",
    });
    models.Music.hasMany(models.Playlist, {
      foreignKey: "music_id",
      sourceKey: "id",
      onDelete: "CASCADE",
    });
  }
}

module.exports = Music;
