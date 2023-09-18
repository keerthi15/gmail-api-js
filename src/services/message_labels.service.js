/* eslint-disable max-len */
const { gmailDb } = require('../../config/dbConfig');
const { getArrayMap } = require('../handlers/utils');
const sequelize = require('../models/db')(gmailDb);
const { messages_label_mapping: MessageLabels } = require('../models/init-models')(sequelize);

/**
 * Delete existing labels of a message
 * Create new relevant labels of the message
 *
 * @param {Number} messageId
 * @param {[Number]} labelIds
 */
const upsertMessageLabels = async (messageId, labelIds) => {
    await deleteMessageLabelMappings(messageId);
    await createMessageLabelMapping(labelIds);
};

/**
 * Returns messages mapped to a label
 * @param {[Number]} labelIds
 * @return {Object}
 */
const getMessageLabels = async (labelIds) => {
    const messageLabels = await MessageLabels.findAll({
        where: {
            label_id: labelIds,
        },
    });

    if (!messageLabels) {
        return;
    }

    const messageLabelMap = getArrayMap(messageLabels, 'message_id', 'label_id');

    return messageLabelMap;
};

/**
 * Creates multiple message label records
 * @param {[Object]} labelIds
 */
const createMessageLabelMapping = async (labelIds) => {
    await MessageLabels.bulkCreate(labelIds);
};

/**
 * Deletes labels mapping of a specific message id
 * @param {Number} messageId
 */
const deleteMessageLabelMappings = async (messageId) => {
    await MessageLabels.destroy({
        where: {
            message_id: messageId,
        },
    });
};

/**
 * Returns all labels mapped to a message
 * @param {[Number]} messageIds
 * @return {[Number]}
 */
const getLabelsByMessageId = async (messageIds) => {
    const messageLabels = await MessageLabels.findAll({
        attr: [ 'label_id' ],
        where: {
            message_id: messageIds,
        },
    });
    const labelIds = messageLabels.map((msgLabel) => {
        return msgLabel.label_id;
    });
    return labelIds;
};

/**
 * Create message - label mapping objects for a particular message
 * @param {Number} messageId
 * @param {[String]} messageLabels
 * @param {Object} labelsMap
 * @return {Object}
 */
const constructMessageLabelMapping = (messageId, messageLabels, labelsMap) => {
    const messageLabelMap = [];
    messageLabels.forEach((label) => {
        messageLabelMap.push({
            'label_id': labelsMap[label],
            'message_id': messageId,
        });
    });
    return messageLabelMap;
};

module.exports= {
    upsertMessageLabels,
    getMessageLabels,
    getLabelsByMessageId,
    constructMessageLabelMapping,
};
