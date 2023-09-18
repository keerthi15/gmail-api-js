const { saveLabels } = require('../services/labels.service');

/**
 * Imports all labels of the current user
 * Creates the labels locally
 *
 * @param {gmail_v1.Gmail} gmailClient
 * @param {Number} clientId
 * @return {Promise}
 */
const labelsProcessor = async (gmailClient, clientId) => {
    const labels = await importLabels(gmailClient);

    await saveLabels(labels, clientId);

    return true;
};

/**
 * Lists all the labels of the user using gmail API
 *
 * @param {gmail_v1.Gmail} gmailClient
 * @return {[Object]} labelsList
 */
const importLabels = async (gmailClient) => {
    const res = await gmailClient.users.labels.list({
        userId: 'me',
    });

    const labelsList = res.data.labels;
    if (!labelsList || labelsList.length === 0) {
        console.log('No labels found.');
        return;
    }

    return labelsList;
};


module.exports = {
    labelsProcessor,
};
