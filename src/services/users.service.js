const { gmailDb } = require('../../config/dbConfig');
const sequelize = require('../models/db')(gmailDb);
const { users: Users } = require('../models/init-models')(sequelize);

/**
 * Creates new user record for the client on the DB if not exists
 * If user exists, update the updated_date to record the last authorized time
 * @param {String} clientId
 * @return {Number} userId
 */
const getUser = async (clientId) => {
    let userInstance = await Users.findOne({
        where: {
            client_id: clientId,
        },
    });

    if (userInstance) {
        userInstance.updated_date = Math.floor(Date.now()/1000);
        await userInstance.save();
    }
    else {
        userInstance = await Users.create({
            client_id: clientId,
            created_date: Math.floor(Date.now()/1000),
            updated_date: Math.floor(Date.now()/1000),
        });
    }

    if (userInstance && userInstance.dataValues) {
        return userInstance.dataValues.user_id;
    };
};

module.exports= {
    getUser,
};
