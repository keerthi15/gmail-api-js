const { getGmailClient } = require('./src/handlers/auth');
const { labelsProcessor } = require('./src/handlers/labels');

/**
 * Initializes the gmail client.
 * Gets the user id associated to the gmail account.
 * Imports and processes the labels on gmail.
 */
const run = async () => {
    try {
        const { userId, gmailClient } = await getGmailClient();

        await labelsProcessor(gmailClient, userId);
    }
    catch (err) {
        console.error(err);
        process.exit(0);
    }
};

/**
 * Asynchronous function / entry point to import gmail labels of a specific user
 */
(async () => {
    console.log('LABELS IMPORTER');

    await run();

    console.log('Importer Process Completed');
    process.exit(0);
})();

