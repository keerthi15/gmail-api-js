const { getGmailClient } = require('./src/handlers/auth');
const { messageProcessor } = require('./src/handlers/messages');

/**
 * Initializes the gmail client.
 * Gets the user id associated to the gmail account.
 * Imports and processes the messages on gmail.
 */
const run = async () => {
    try {
        const { userId, gmailClient } = await getGmailClient();

        await messageProcessor(gmailClient, userId);
    }
    catch (err) {
        console.error(err);
        process.exit(0);
    }
};

/**
 * Asynchronous function / entry point to import messages of a specific user
 */
(async () => {
    console.log('MESSAGES IMPORTER');

    await run();

    console.log('Importer Process Completed');
    process.exit(0);
})();
