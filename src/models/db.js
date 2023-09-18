const Sequelize = require('sequelize');

module.exports = function (dbConfig) {
    return new Sequelize(
        dbConfig.database,
        dbConfig.username,
        dbConfig.password, {
            dialect: 'mysql',
            host: dbConfig.host,
            port: dbConfig.port,
        });
};
