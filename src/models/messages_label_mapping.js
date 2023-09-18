/* eslint-disable new-cap */
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('messages_label_mapping', {
        mapping_id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        message_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        label_id: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
    }, {
        sequelize,
        tableName: 'messages_label_mapping',
        timestamps: false,
        indexes: [
            {
                name: 'PRIMARY',
                unique: true,
                using: 'BTREE',
                fields: [
                    { name: 'mapping_id' },
                ],
            },
        ],
    });
};
