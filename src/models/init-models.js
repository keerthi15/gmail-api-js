/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
/* eslint-disable camelcase */
const DataTypes = require('sequelize').DataTypes;
const _labels = require('./labels');
const _messages = require('./messages');
const _messages_label_mapping = require('./messages_label_mapping');
const _users = require('./users');

function initModels (sequelize) {
    const labels = _labels(sequelize, DataTypes);
    const messages = _messages(sequelize, DataTypes);
    const messages_label_mapping = _messages_label_mapping(sequelize, DataTypes);
    const users = _users(sequelize, DataTypes);


    return {
        labels,
        messages,
        messages_label_mapping,
        users,
    };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
