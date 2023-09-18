/* eslint-disable max-len */
const { gmailDb } = require('../../config/dbConfig');
const { getArrayMap } = require('../handlers/utils');
const sequelize = require('../models/db')(gmailDb);
const { messages_label_mapping: MessageLabels } = require('../models/init-models')(sequelize);

const upsertMessageLabels = async (messageId, labelIds) => {
    await deleteMessageLabelMappings(messageId);
    await createMessageLabelMapping(labelIds);
};

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

const createMessageLabelMapping = async (labelIds) => {
    await MessageLabels.bulkCreate(labelIds);
};

const deleteMessageLabelMappings = async (messageId) => {
    await MessageLabels.destroy({
        where: {
            message_id: messageId,
        },
    });
};

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
