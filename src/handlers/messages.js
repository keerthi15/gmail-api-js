const striptags = require('striptags');
const { saveMessages } = require('../services/messages.service');

// eslint-disable-next-line max-len
const MESSAGE_IMPORT_LIMIT= 50; // Hardcoded value of no. of messages to be imported.

/* Specific fields of the message to be imported.
 * Ideally can be a part of the environment file
 */

const requiredMessageHeaders = [ 'Date', 'From', 'To', 'Subject' ];

/**
 * Imports all labels of the current user
 * Creates the labels locally
 *
 * @param {gmail_v1.Gmail} gmail
 * @param {Number} clientId
 * @return {*}
 */
const messageProcessor = async (gmail, clientId) => {
    const messages = await importMessages(gmail);

    await saveMessages(messages, clientId);

    return true;
};

/**
 * Lists the latest 10 messages of the user using gmail API
 * Fetches the message details and returns in a specific format
 *
 * @param {gmail_v1.Gmail} gmail
 * @return {[Object]}
 */
const importMessages = async (gmail) => {
    const res = await gmail.users.messages.list({
        userId: 'me',
        maxResults: MESSAGE_IMPORT_LIMIT,
    });

    const messageList = res.data.messages;

    if (!messageList || messageList.length === 0) {
        console.error('No messages found.');
        return;
    }

    // Get details of each message
    const messages = await Promise.all(messageList.map(async (message) => {
        try {
            const messageData = await getMessageDetails(gmail, message);
            return messageData;
        }
        catch (err) {
            console.log(err);
            throw new Error(err);
        }
    }));

    return messages;
};

/**
 *
 * @param {gmail_v1.Gmail} gmail
 * @param {[Object]} message
 * @return {[Object]}
 */
const getMessageDetails = async (gmail, message) => {
    const messageDetailsResponse = await gmail.users.messages.get({
        userId: 'me',
        id: message.id,
        format: 'full',
    });
    let messageData = messageDetailsResponse.data;

    messageData = formatMessageData(messageData);

    if (!messageData) {
        return;
    }
    return messageData;
};


/**
 * Formats the message details in a specific object structure
 * @param {Object} messageData
 * @return {Object}
 */
const formatMessageData = (messageData) => {
    if (!messageData.payload || !messageData.payload.headers) {
        throw new Error(`No payload found for message - ${messageData.id}`);
        return;
    }

    const metadata = getMetaData(
        messageData.payload.headers,
        messageData.payload.body,
        messageData.payload.parts,
    );
    const formattedMessage = {
        messageId: messageData.id,
        threadId: messageData.threadId,
        labels: messageData.labelIds,
        ...metadata,
    };
    return formattedMessage;
};

/**
 * Extracts the metadata and converts the data into the required datatype
 * @param {Object} messageHeader
 * @param {Object} messageBody
 * @param {[Object]} messageParts
 * @returns
 */
// eslint-disable-next-line max-len
const getMetaData = (messageHeader, messageBody = null, messageParts = null) => {
    const metadata = {};
    messageHeader.forEach( (headerElement) => {
        if (requiredMessageHeaders.includes(headerElement.name)) {
            if (headerElement.name == 'From') {
                headerElement.value = getEmailAddress(headerElement.value);
            }
            metadata[(headerElement.name).toLowerCase()] = headerElement.value;
        }
    });

    if (messageBody.data) {
        metadata.body = decodeMessage(messageBody.data);
    }

    if (messageParts) {
        messageParts.forEach((part) => {
            if (!part.body.data) {
                return;
            }
            metadata.body += decodeMessage(part.body.data);
        });
    }
    return metadata;
};

/**
 * Converts Base64 encoded string to utf8 format
 * Removes html tags and css styles from the string if any
 * @param {String} encodedMsg
 * @return {String}
 */
const decodeMessage = (encodedMsg) => {
    const bufferObj = Buffer.from(encodedMsg, 'base64');

    // Encode the Buffer as a utf8 string
    const decodeMessage = striptags(bufferObj.toString('utf8')
        .replace(/<style([\S\s]*?)>([\S\s]*?)<\/style>/g, '')
        .replaceAll('\r\n', ' ')
        .replaceAll('  ', ''),
    );

    return (decodeMessage)?(decodeMessage):null;
};

/**
 * Extracts the email address from the string
 * @param {String} address
 * @return {String}
 */
const getEmailAddress = (address) => {
    const emailPattern = /[\w\.-]+@[\w\.-]+/;
    const match = address.match(emailPattern);
    return (match && match[0])?(match[0]):address;
};

module.exports = {
    messageProcessor,
    importMessages,
};

