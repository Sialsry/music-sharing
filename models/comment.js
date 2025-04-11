// const { DataTypes, Model } = require('sequelize');

// class Comment extends Model {
//     static init(sequelize) {
//         return super.init({
//             playlistName: {
//                 type: DataTypes.STRING(50),
//                 allowNull: false
//             },
//             comment: {
//                 type: DataTypes.STRING(200),
//                 allowNull: false
//             }
//         }, {
//             sequelize,
//             timestamps: true,
//             modelName: 'Comment',
//             tableName: 'comments',
//             charset: 'utf8mb4',
//             collate: 'utf8mb4_general_ci'
//         })
//     }

//     static associate(models) {
//         models.Comment.belongsTo(models.User, { foreignKey: 'user_id', targetKey: 'uid', onDelete: 'CASCADE' })
//         models.Comment.belongsTo(models.Playlist, { foreignKey: 'music_id', targetKey: 'id', onDelete: 'CASCADE' })
//     }

// }

// module.exports = Comment;