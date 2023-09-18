const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const { authenticate } = require('@google-cloud/local-auth');
const { google } = require('googleapis');

const { getUser } = require('../services/users.service');

// Scopes to be loaded from env file
const SCOPES = [ 'https://www.googleapis.com/auth/gmail.modify' ];

// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(
    process.cwd()+'/credentials', 'token.json');

const CREDENTIALS_PATH = path.join(
    process.cwd()+'/credentials', 'credentials.json',
);


/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize () {
    let client = await loadSavedCredentialsIfExist();
    if (client) {
        return client;
    }
    client = await authenticate({
        scopes: SCOPES,
        keyfilePath: CREDENTIALS_PATH,
    });
    if (client.credentials) {
        await saveCredentials(client);
    }
    return client;
}

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist () {
    try {
        const content = await fs.readFile(TOKEN_PATH);
        const credentials = JSON.parse(content);
        return google.auth.fromJSON(credentials);
    }
    catch (err) {
        return null;
    }
}

/**
 * Serializes credentials to a file compatible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials (client) {
    const content = await fs.readFile(CREDENTIALS_PATH);
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
        type: 'authorized_user',
        client_id: key.client_id,
        client_secret: key.client_secret,
        refresh_token: client.credentials.refresh_token,
    });
    await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Authorizes the user based on credentials file.
 * Initializes the gmailClient to connect with gmail APIs
 * Creates or Updates the user on the local DB on every authorization
 *
 * @return {Object} {userId: NUMBER, gmailClient: gmail_v1.Gmail}
 */
const getGmailClient = async () => {
    const auth = await authorize();
    const gmailClient = google.gmail({ version: 'v1', auth });

    if (!auth._clientId) {
        console.log('Authentication Error occured.');
        process.exit(0);
    }
    const userId = await getUser(auth._clientId);

    return {
        userId,
        gmailClient,
    };
};

module.exports = {
    authorize,
    getGmailClient,
};
