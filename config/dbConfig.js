/**
 * The DB credentials will ideally be imported from the env file
 * Hardcoding the credentials and host details here for simplicity purposes
 */

const gmailDb = {
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'root',
    database: 'gmail_db',
};

module.exports = {
    gmailDb,
};
