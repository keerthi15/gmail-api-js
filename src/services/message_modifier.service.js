/* eslint-disable max-len */
const { getGmailClient } = require('../handlers/auth');
const { getGmailLabelIds, getLabelsByIds } = require('../services/labels.service');
const { getLabelsByMessageId } = require('../services/message_labels.service');

const { actions } = require('../../config/rules');

/**
 * Execute the label actions on the messages filtered based on the input conditions
 *
 * @param {Object} messageIdsMap
 * @param {Object} inputPayloads
 */
const executeActions = async (messageIdsMap, inputPayloads) => {
    const { messageActions, labels } = inputPayloads;

    // Authenticate user, get user id and gmailClient
    const { userId, gmailClient } = await getGmailClient();

    const messageIds = Object.values(messageIdsMap);
    const gmailMessageIds = Object.keys(messageIdsMap);

    // Get labels to be added or removed from the messages
    const { addLabelIds, removeLabelIds } = await getModifyLabelParams(userId, messageIds, messageActions, labels);

    // Update labels / status of filtered messages
    await modifyMessageLabels(gmailClient, gmailMessageIds, addLabelIds, removeLabelIds);
};

/**
 * Get modify-labels to be added or removed from the messages
 *
 * @param {Number} userId
 * @param {[Number]} messageIds
 * @param {[String]} messageActions
 * @param {[String]} labels
 * @return {Object} {addLabelIds, removeLabelIds}
 */
const getModifyLabelParams = async (userId, messageIds, messageActions, labels) => {
    let addLabels = [];
    let removeLabels = [];

    messageActions.forEach((msgAction) => {
        if (!actions[msgAction]) {
            console.error(`Invalid action - ${msgAction}`);
            return;
        }

        const { remove, add } = actions[msgAction];

        if (add && add.length != 0) {
            addLabels = [ ...addLabels, ...add ];
        }
        if (remove && remove.length != 0) {
            removeLabels = [ ...removeLabels, ...remove ];
        }
    });

    // Include additional labels if provided
    if (labels.length) {
        addLabels = [ ...labels ];
    }

    // Get unique labels to add and remove from messages
    addLabels = [ ...new Set(addLabels) ];
    removeLabels = [ ...new Set(removeLabels) ];

    // get gmail account based labels id for the user
    let addLabelIds = await getGmailLabelIds(userId, addLabels);
    let removeLabelIds = await getGmailLabelIds(userId, removeLabels);


    // Specific to ARCHIVE messages condition
    // If remove labels input has "ALL" then remove all labels on the filtered messages
    if (removeLabels.indexOf('ALL') >= 0) {
        addLabelIds = [];
        const messageLabels = await getLabelsByMessageId(messageIds);
        removeLabelIds = await getLabelsByIds(messageLabels);
    }

    return { addLabelIds, removeLabelIds };
};

/**
 * Uses Gmail APIs to modify the labels on messages
 * Adds new labels and Removes existing labels based on input actions
 *
 * @param {gmail_v1.Gmail} gmailClient
 * @param {[String]} messageIds
 * @param {[String]} addLabelIds
 * @param {[String]} removeLabelIds
 */
const modifyMessageLabels = async (gmailClient, messageIds, addLabelIds, removeLabelIds) => {
    await gmailClient.users.messages.batchModify({
        userId: 'me',
        ids: messageIds,
        addLabelIds,
        removeLabelIds,
    });

    return;
};

module.exports = {
    executeActions,
};
