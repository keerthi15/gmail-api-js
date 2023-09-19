const chai = require('chai');
const asserttype = require('chai-asserttype');
chai.use(asserttype);
// eslint-disable-next-line no-unused-vars
const assert = chai.assert;
const auth = require('../src/handlers/auth');
const labels = require('../src/handlers/labels');
const messages = require('../src/handlers/messages');

describe('Email Fetching and Database', function () {
    it('should fetch labels from Gmail API', async function () {
        const { gmailClient } = await auth.getGmailClient();
        const labelsList = await labels.importLabels(gmailClient);
        chai.expect(labelsList.length).to.greaterThan(0);
    });

    it('should fetch emails from GMail API', async function () {
        const { gmailClient } = await auth.getGmailClient();
        const messageList = await messages.importMessages(gmailClient);
        chai.expect(messageList.length).to.greaterThan(0);
    });
});

