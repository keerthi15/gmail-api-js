/* eslint-disable new-cap */
const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('messages', {
        message_id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        gmail_message_ref_id: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        thread_id: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        from_email: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        to_email: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        email_subject: {
            type: DataTypes.STRING(1000),
            allowNull: false,
        },
        email_body: {
            type: Sequelize.TEXT('long'),
            allowNull: false,
        },
        created_date: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        sequelize,
        tableName: 'messages',
        timestamps: false,
        indexes: [
            {
                name: 'PRIMARY',
                unique: true,
                using: 'BTREE',
                fields: [
                    { name: 'message_id' },
                ],
            },
            {
                name: 'gmail_message_id_unique',
                unique: true,
                using: 'BTREE',
                fields: [
                    { name: 'gmail_message_ref_id' },
                    { name: 'thread_id' },
                ],
            },
        ],
    });
};
