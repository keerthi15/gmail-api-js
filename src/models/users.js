/* eslint-disable new-cap */
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('users', {
        user_id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        client_id: {
            type: DataTypes.STRING(100),
            allowNull: true,
            unique: 'client_id',
        },
        created_date: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        updated_date: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    }, {
        sequelize,
        tableName: 'users',
        timestamps: false,
        indexes: [
            {
                name: 'PRIMARY',
                unique: true,
                using: 'BTREE',
                fields: [
                    { name: 'user_id' },
                ],
            },
            {
                name: 'client_id',
                unique: true,
                using: 'BTREE',
                fields: [
                    { name: 'client_id' },
                ],
            },
        ],
    });
};
