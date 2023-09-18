const { gmailDb } = require('../../config/dbConfig');
const sequelize = require('../models/db')(gmailDb);
const { messages: Messages } = require('../models/init-models')(sequelize);
const { upsertMessageLabels, constructMessageLabelMapping } =
        require('../services/message_labels.service');
const { getLabelsByUser } = require('../services/labels.service');

/**
 *
 * Formats the message details and upserts new message records on DB
 *
 * @param {Object} messageObjs
 * @param {Number} userId
 */
const saveMessages = async (messageObjs, userId) => {
    messageObjs = messageObjs.map((obj) => {
        if (!obj.messageId) {
            return false;
        }
        return {
            user_id: userId,
            gmail_message_ref_id: obj.messageId,
            thread_id: obj.threadId,
            labels: obj.labels,
            from_email: obj.from,
            to_email: obj.to,
            email_subject: obj.subject,
            email_body: obj.body,
            created_date: new Date(obj.date).getTime()/1000,
        };
    });

    // Get gmail label - label id map based on user
    const labelsMap = await getLabelsByUser(userId);

    await Promise.all(messageObjs.map(async (message) => {
        if (!message || !message.email_body || !message.email_subject) {
            return true;
        }
        const messageLabels = message.labels;
        const messageId = await upsertMessage(message, labelsMap);

        // Create new message_label_mapping record for each label of the message
        if (messageId) {
            const labelIds = constructMessageLabelMapping(
                messageId, messageLabels, labelsMap);
            await upsertMessageLabels(messageId, labelIds);
        }
    }));
};

/**
 * Create message if not exists and also return message id
 *
 * @param {Object} messageObj
 * @return {Number}
 */
const upsertMessage = async (messageObj) => {
    let message = await Messages.findOne({
        where: {
            gmail_message_ref_id: messageObj.gmail_message_ref_id,
            user_id: messageObj.user_id,
        },
    });

    delete messageObj.labels;

    if (!message) {
        message = await Messages.create(messageObj);
    }

    return message.message_id;
};

/**
 * Returns messages based on query params
 *
 * @param {Object} queryParams
 * @return {Object}
 */
const getMessages = async (queryParams) => {
    const messages = await Messages.findAll({
        where: queryParams,
    });
    return messages;
};

module.exports= {
    saveMessages,
    getMessages,
};
