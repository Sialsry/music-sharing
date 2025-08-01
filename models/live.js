const { Model, DataTypes} = require('sequelize')

class Live extends Model {
    static init(sequelize) {
        return super.init({
            live_url: {
                type: DataTypes.STRING(150),
                allowNull: false
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Live',
            tableName: 'lives',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci'
        });
    }

    static associate(models) {
        models.Live.belongsTo(models.User, { foreignKey: 'user_id', targetKey: 'uid',onDelete: 'CASCADE'});
    }
}

module.exports = Live;