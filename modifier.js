const { prepareQuery } = require('./src/services/query_modifier.service');
const { executeActions } = require('./src/services/message_modifier.service');
const { getMessages } = require('./src/services/messages.service');
const { getKeyValMap } = require('./src/handlers/utils');

const run = async () => {
    // Sample input payload for modifying the status of messages
    const inputPayload = {
        'condition': {
            'SUBJECT': {
                'data': 'Software',
                'operation': 'CONTAINS',
            },
            'DATETIME': {
                'data': 1694884295,
                'operation': 'GREATER',
            },
        },
        'predicate': 'ALL',
        'messageActions': [ 'READ' ],
        'labels': [ 'Interview' ],
    };

    // Building the query params
    // to fetch the messages that satisfy the conditions
    const queryParams = prepareQuery(inputPayload);

    if (!queryParams) {
        throw new Error(`Something went wrong with constructing the query`);
    }

    // Get messages based on queryParams that satisfy the input conditions
    const messages = await getMessages(queryParams);

    // Construct Key-Value pair of gmail_message_ref_id and message_id
    const messageIdsMap = getKeyValMap(
        messages, 'gmail_message_ref_id', 'message_id');

    // Execute the messageActions and add labels to the messages
    await executeActions(messageIdsMap, inputPayload);

    process.exit(0);
};

run()
    .then(() => console.log('Process completed'))
    .catch((err) => console.log(err));
