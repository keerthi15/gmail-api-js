const chai = require('chai');
const asserttype = require('chai-asserttype');
chai.use(asserttype);
const assert = chai.assert;
const auth = require('../src/handlers/auth');

describe('Authentication', function () {
    it('should authenticate successfully', async function () {
        const { userId, gmailClient } = await auth.getGmailClient();
        assert.equal(userId, 1);
        chai.expect(gmailClient).to.be.object();
    });
});

