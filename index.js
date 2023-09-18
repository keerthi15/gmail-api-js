const { getGmailClient } = require('./src/handlers/auth');
const { labelsProcessor } = require('./src/handlers/labels');
const { messageProcessor } = require('./src/handlers/messages');

/**
 * Initializes the gmail client.
 * Gets the user id associated to the gmail account.
 * Imports and processes the labels and messages on gmail.
 */
const run = async () => {
    try {
        const { userId, gmailClient } = await getGmailClient();

        console.log('LABELS:');
        await labelsProcessor(gmailClient, userId);

        console.log('MESSAGES:');
        await messageProcessor(gmailClient, userId);

        process.exit(0);
    }
    catch (err) {
        console.error(err);
        process.exit(0);
    }
};

/**
 * Asynchronous function / entry point
 * to import both labels and messages of a specific user
 */
run()
    .then(() => console.log('Process completed'))
    .catch((err) => console.log(err));
