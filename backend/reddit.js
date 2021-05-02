const snoowrap = require('snoowrap');

const secrets = require('./secrets.json');

const reddit = new snoowrap({
  userAgent: 'subreddit subscriptions app v1.0',
  clientId: secrets.clientId,
  clientSecret: secrets.clientSecret,
  refreshToken: secrets.refreshToken,
});
reddit.config({ requestDelay: 1000 });

module.exports = reddit;
