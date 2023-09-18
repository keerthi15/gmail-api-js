/* eslint-disable new-cap */
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('labels', {
        label_id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        gmail_label_id: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        label_name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        label_type: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
    }, {
        sequelize,
        tableName: 'labels',
        timestamps: false,
        indexes: [
            {
                name: 'PRIMARY',
                unique: true,
                using: 'BTREE',
                fields: [
                    { name: 'label_id' },
                ],
            },
        ],
    });
};
