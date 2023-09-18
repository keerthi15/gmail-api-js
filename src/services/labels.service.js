const { gmailDb } = require('../../config/dbConfig');
const { getKeyValMap } = require('../handlers/utils');
const sequelize = require('../models/db')(gmailDb);
const { labels: Labels } = require('../models/init-models')(sequelize);

/**
 *
 * Formats the label details and upserts new label records on DB
 *
 * @param {Object} labelsObj
 * @param {Number} clientId
 */
const saveLabels = async (labelsObj, clientId) => {
    labelsObj = labelsObj.map((obj) => {
        return {
            gmail_label_id: obj.id,
            user_id: clientId,
            label_name: obj.name,
            label_type: obj.type,
        };
    });

    await Promise.all(labelsObj.map(async (label) => {
        await upsertLabel(label);
    }));
};

/**
 * Creates new label record for user if not exists
 *
 * @param {Object} labelObj
 * @return {Number}
 */
const upsertLabel = async (labelObj) => {
    let label = await Labels.findOne({
        where: {
            gmail_label_id: labelObj.gmail_label_id,
            user_id: labelObj.user_id,
        },
    });

    if (!label) {
        label = await Labels.create(labelObj);
    }

    if (label && label.dataValues) {
        return label.dataValues.label_id;
    };
};

/**
 * Get gmail label and labels ids key-value pair based on user id
 * @param {Number} userId
 * @return {Object}
 */
const getLabelsByUser = async (userId) => {
    const labels = await Labels.findAll({
        where: {
            user_id: userId,
        },
    });

    if (!labels) {
        console.log(`No labels found for user ${userId}`);
        return null;
    }

    const labelsMap = getKeyValMap(labels, 'gmail_label_id', 'label_id');
    return labelsMap;
};

/**
 * Get gmail account based labels id for the user
 * @param {Number} userId
 * @param {[String]} labels
 * @return {[String]} gmailLabelIds
 */
const getGmailLabelIds = async (userId, labels) => {
    const labelNames = await Labels.findAll({
        attr: [ 'gmail_label_id' ],
        where: {
            label_name: labels,
            user_id: userId,
        },
    });
    const gmailLabelIds = labelNames.map((labelName) => {
        return labelName.gmail_label_id;
    });
    return gmailLabelIds;
};

/**
 * Get gmail account's label ids
 * @param {[Number]} labelIds
 * @return {[String]} gmailLabelIds
 */
const getLabelsByIds = async (labelIds) => {
    const labelNames = await Labels.findAll({
        attr: [ 'gmail_label_id' ],
        where: {
            label_id: labelIds,
        },
    });
    const gmailLabelIds = labelNames.map((labelName) => {
        return labelName.gmail_label_id;
    });
    return gmailLabelIds;
};


module.exports = {
    saveLabels,
    getLabelsByUser,
    getGmailLabelIds,
    getLabelsByIds,
};
